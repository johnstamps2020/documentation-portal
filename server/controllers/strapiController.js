const qs = require('qs');
// TODO standardize on axios
//const fetch = require('node-fetch-retry');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { winstonLogger } = require('./loggerController');
const STRAPI_API_URL = 'http://localhost:1337/api';
const SAFECONFIG_URL = 'http://localhost:8081/safeConfig';

async function getPageInfo(url) {
    try {
      const query = qs.stringify({
        filters: {
          relativeUrl: {
            $eq: url
          },
        },
        populate: [
            'layout.items',
            'layout.items.document',
            'layout.productFamily',
            'layout.productFamily.document',
            'layout.productFamily.page',
            'layout.category',
            'layout.categoryItem',
            'layout.categoryItem.page',
            'layout.category.subcategory',
            'layout.subcategory.subcategoryItem',
            'layout.subcategory.subcategoryItem.page'
        ]
      },
      {
        encodeValuesOnly: true,
      });

      const response = await fetch(`${STRAPI_API_URL}/pages?${query}`,
      {
            retry: 5,
            pause: 1000,
            callback: retry => {
              console.log(`Retrying fetch of ${STRAPI_API_URL}/pages`);
            },
      });
      if(response.ok) {
        const responseJson = await response.json();
        return responseJson.data[0];
      }
      return;
    } catch (err) {
      winstonLogger.error(
      `Problem getting page info for "${url}"
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

async function importFlailPageToStrapi(relativeUrl) {
    const staticPagesDir = path.join(__dirname, '..', 'static', 'pages');
    const configFilePath = decodeURI(
        path.join(staticPagesDir, relativeUrl, 'index.json')
    );
    // TODO add error reporting    
    return await convertFlailPageToStrapi(configFilePath);   
}

async function importAllFlailToStrapi() {
    const staticPagesDir = path.join(__dirname, '..', 'static', 'pages');
    for (const filePath of walkSync(staticPagesDir)) {   
        await convertFlailPageToStrapi(filePath);
    }
}

/* 
* Reads a Flail page and creates a Strapi page object
* for import to Strapi
*/
async function convertFlailPageToStrapi(file) { 
    const staticPagesDir = path.join(__dirname, '..', 'static', 'pages');
    if (path.basename(file) !== 'index.json') {
            return;
    }
    const configFileExists = fs.existsSync(file);
    if (!configFileExists) {
    console.error(`Flail file ${file} could not be found.`);
    }
    const flailFileContents = fs.readFileSync(file, 'utf-8');
    const flailJson = JSON.parse(flailFileContents);
    const relativeUrl = path.relative(staticPagesDir, file).replace(/\\/g, '/').replace('/index.json', '');

    // TODO parse selector

    let strapiJson = {};
    strapiJson.relativeUrl = relativeUrl;
    strapiJson.title = flailJson.title;
    strapiJson.template = flailJson.template;
    strapiJson.class = flailJson.class;
    if (flailJson.class.includes('twoColumns')) {
        strapiJson.layout = await processTwoColumnLayout(flailJson);
        // TODO: see if page exists first
        //postNewPage(strapiJson);  
    }
    // add threeCards
    if (flailJson.class.includes('threeCards') && flailJson.items[0].items) {
        strapiJson.layout = await processCategoryLayout(flailJson, relativeUrl);
        // TODO: see if page exists first
        await postNewPage(strapiJson);  
    }

    if (flailJson.class.includes('threeCards') && !flailJson.items[0].items) {
        strapiJson.layout = await processProductLayout(flailJson, relativeUrl);
        //strapiJson.layout = createStrapiLayout(flailJson, relativeUrl, 'category');
        // TODO: see if page exists first
        //postNewPage(strapiJson);  
    }
    return strapiJson;
}

// following not likely to be used
// TODO separate item creation logic to a function that can be used for either
// subject or category pages. Merge the 'process' functions to make it DRY.

async function createStrapiLayout(flailJson, relativeUrl, layoutType) {
  const strapiJsonLayout = [];

  for (const topLevelItem of flailJson.items) {
      const strapiTopLevelItem = {
          "__component": layoutType,
          "name": topLevelItem.label,
          "class": topLevelItem.class
      };
      console.log(topLevelItem);
      if (topLevelItem.items) {
         strapiTopLevelItem.layout = createStrapiItems(topLevelItem, relativeUrl);
       
      }
      strapiJsonLayout.push(strapiTopLevelItem);      
  } 
  return strapiJsonLayout;
}

async function createStrapiItem(item, relativeUrl) {
  if( item.class === 'group' ) {
    return
  }
  let strapiItem = {};
  strapiItem.label = item.label;
    if ( item.class ) {
      strapiItem.class = item.class;
    }
    
    if ( item.id ) {
      strapiItem.document = {};
      await getStrapiDocByDocId(item.id).then(function(response) {
        if(response == undefined) {
            return
        }
        
        strapiItem.document.id = response.data.id;
      });

      if (strapiItem.document.id === undefined) {
        // TODO add error handling
        await makeStrapiDocObject(item.id).then(async response => {
          const strapiDoc = response;
          if (strapiDoc === undefined) {
              console.error(`Could not find Flail doc with docId ${item.id}.`)
              return;
          }
          strapiItem = Object.assign(strapiItem, strapiDoc);
          await postNewDoc(strapiDoc).then(response => {
            if ( response ) {
              strapiItem.document.id = response.data.id;
            }     
          })
          .catch(err => {console.error(err)});
        });       
      }
    }
    if ( item.link ) {
      strapiItem.link = item.link; 
    }

    if ( item.page ) {
      strapiItem.pageUrl = path.join(relativeUrl, item.page).replace(/\\/g, '/');
    }   
  
  return strapiItem;
}

async function processCategoryLayout(flailJson, relativeUrl) {
  console.log('processing category layout');
    const strapiJsonLayout = [];

    for (const category of flailJson.items) {
        const strapiCategory = {
            "__component": "layout.category",
            "name": category.label,
            "class": category.class
        };
        const categoryItems = [];
        strapiCategory.subcategory = [];

        for (const categoryItem of category.items) {
          if (categoryItem.class !== 'group') {
            const strapiItem = await createStrapiItem(categoryItem, relativeUrl);
            categoryItems.push(strapiItem);
          }
          if (categoryItem.items) {
            const subcategory = {
              label: categoryItem.label,
              class: categoryItem.class,
              subcategoryItem: []
            }
            
            for (const subItem of categoryItem.items ) {
              const strapiSubItem = {
                label: subItem.label,
              }
              if ( subItem.class ) {
                strapiSubItem.class = categoryItem.class;
              }
              subcategory.subcategoryItem.push(await createStrapiItem(subItem, relativeUrl));
            }
            strapiCategory.subcategory.push(subcategory);
          }
        }
        
        strapiCategory.categoryItem = categoryItems;
        strapiJsonLayout.push(strapiCategory);      
    } 
    return strapiJsonLayout;  
}

async function processTwoColumnLayout(flailJson) {
    const strapiJsonLayout = [];

    for (const subject of flailJson.items) {
        const strapiSubject = {
            "__component": "layout.subject",
            "label": subject.label,
            "class": subject.class
        };
        const strapiItems = [];
  
        for (const item of subject.items) {
            let strapiItem = {
                label: item.label,
                document: {}
            };

            if ( item.id ) {
              strapiItem.document = {};
              await getStrapiDocByDocId(item.id).then(function(response) {
                if(response == undefined) {
                    return
                }
                strapiItem.document.id = response.data.id;
                strapiItems.push(strapiItem);
              }); 
            
              if (strapiItem.document.id === undefined) {
                  // TODO add error handling
                  const strapiDoc = await makeStrapiDocObject(item.id);
                  if (strapiDoc === undefined) {
                      console.error(`Could not find Flail doc with docId ${item.id}.`)
                      return;
                  }
                  strapiItem = Object.assign(strapiItem, strapiDoc);
                  // TODO add error checking and don't add page if there is a problem
                  await postNewDoc(strapiDoc).then(function(response) {
                      if (response) {                       
                          strapiItem.document.id = response.data.id;
                          strapiItems.push(strapiItem);
                      }
                  })
                  .catch(err => {console.error(err)});
              }

            }
            if ( item.link ) { 
              strapiItem.link = item.link;
            }
            
            
        }
        strapiSubject.items = strapiItems;
        strapiJsonLayout.push(strapiSubject);      
    } 
    return strapiJsonLayout;  
}

/*
* Creates a JSON document object based on Flail data
* to later be imported to Strapi
*/
async function makeStrapiDocObject(docId) {
    const strapiDoc = {};
    await axios.get(`${SAFECONFIG_URL}/docMetadata/${docId}`)
        .then(async function (response) {
            if (response.status === 200 && response.data.error !== true) {  
                flailDoc = response.data;
                strapiDoc.docId = docId;
                strapiDoc.title = flailDoc.docTitle;
                strapiDoc.url = flailDoc.docUrl;
                // TODO Make this DRY
                const strapiVersion = [];
                flailDoc.version.forEach((version) => {
                    strapiVersion.push({"name": version});
                });
                strapiDoc.version = strapiVersion;
                const strapiProduct = [];
                flailDoc.product.forEach((product) => {
                    strapiProduct.push({"name": product});
                });
                strapiDoc.product = strapiProduct;
                const strapiSubject = [];
                flailDoc.subject?.forEach((subject) => {
                    strapiSubject.push({"name": subject});
                });
                strapiDoc.subject = strapiSubject;
                const strapiRelease = [];
                flailDoc.release?.forEach((release) => {
                    strapiRelease.push({"name": release});
                });
                strapiDoc.release = strapiRelease;
                // TODO: env is not in the config, so we need to add that
                // let isInProduction = false;
                // flailDoc.env.forEach((env) => {
                //     if(env === "prod") {
                //         isInProduction = true;
                //     }
                // });
                // strapiDoc.isInProduction = isInProduction;
                strapiDoc.earlyAccess = flailDoc.docEarlyAccess;
                strapiDoc.isInternal = flailDoc.docInternal;
                strapiDoc.isPublic = flailDoc.docPublic;
                strapiDoc.buildType = [];
                const strapiBuild = await makeStrapiBuildObject(docId);
                if ( Object.keys(strapiBuild).length > 0 ) {
                  strapiDoc.buildType.push(strapiBuild); 
                }                    
            }
          })
          .catch(err => {
            console.error(`Could not create Strapi doc object. The Flail doc config might not exist. ERROR: ${err}`);
            return;
          });
          return strapiDoc;
}

/*
* Creates a JSON object containing build information
* to be added as the Strapi document object's buildType
*/
async function makeStrapiBuildObject(docId) {
    const buildType = {};
    await axios.get(`${SAFECONFIG_URL}/build/${docId}`)
    .then(async function (response) {
        if (response.status == '200' && response.error !== true) { 
            const flailBuild = response.data;
            if ( flailBuild.buildType === undefined ) {
              return;
            }
            buildType.__component = `builds.${flailBuild.buildType}`;
            switch(flailBuild.buildType) {
              case 'dita':
                buildType.rootMap = flailBuild.root;
                buildType.filter = flailBuild.filter.replace('common-gw/ditavals/', '');
                buildType.indexRedirect = flailBuild.indexRedirect;
                break;
              case 'source-zip':
                buildType.zipFilename = flailBuild.zipFilename;
                break;
              case 'storybook':
                buildType.workingDir = flailBuild.workingDir;
                if (flailBuild.customEnv) {
                  buildType.customEnv = [];
                  for (const {index, customEnv} in flailBuild.customEnv) {
                    buildType.customEnv[index] = {name: customEnv.name, value: customEnv.value};
                  }
                }
                break;
              case 'yarn':
                buildType.nodeImageVersion = flailBuild.nodeImageVersion;
                buildType.workingDir = flailBuild.workingDir;
                if (flailBuild.customEnv) {
                  buildType.customEnv = [];
                  for (const {index, customEnv} in flailBuild.customEnv) {
                    buildType.customEnv[index] = {name: customEnv.name, value: customEnv.value};
                  }
                }
                break;
            }
          
            const strapiSrc = await makeStrapiSourceObject(flailBuild.srcId);
            buildType.source = {};
            buildType.source.id = strapiSrc.id;
        }
    })
    .catch(err => {console.error(err)});

    return buildType;
}

/*
* takes a source id, looks for a match in Strapi.
* If found, returns the sources Strapi id.
* If not found, creates the source in Strapi and
* then retrns the new source's id.
* TODO add error checking if source not created properly.
*/
async function makeStrapiSourceObject(srcId) {
    let source = {};
    const strapiSrc = await getStrapiSourceBySrcId(srcId);
    if (strapiSrc) {
        source.id = strapiSrc.data.id;
        //console.log(strapiSrc);
        return source;
    }

    await axios.get(`${SAFECONFIG_URL}/source/${srcId}`)
    .then(async function (response) {
        if (response.status == '200' && response.error !== true) { 
            const flailSrc = response.data;
            source.srcId = srcId;
            source.title = flailSrc.title
            source.gitUrl = flailSrc.gitUrl;
            source.gitBranch = flailSrc.branch ? flailSrc.branch : 'main';
            if (flailSrc.xdocsPathIds) {
                source.xdocsPathIds = [];
                for (const xdocsPathId of flailSrc.xdocsPathIds) {
                    const obj = {path: xdocsPathId};
                    source.xdocsPathIds.push(obj);
                }
            }
            const postedSource = await postNewSource(source);
            source.id = postedSource.id;
        }
    })
    .catch(err => {console.error(err)});

    return source;
}

async function getStrapiDocByDocId(docId) {
    try {
      const query = qs.stringify({
        filters: {
          docId: {
            $eq: docId
          },
        }
      },
      {
        encodeValuesOnly: true,
      });
      // rework like postNewDoc. If there are errors getting the doc, there is an
      // error about not being able to deconstruct data:response
      const {data:response} = await axios.get(`${STRAPI_API_URL}/documents?${query}`,
      {
            retry: 5,
            pause: 1000,
            callback: retry => {
              console.log(`Retrying fetch of ${STRAPI_API_URL}/documents`);
            },
      })
      .catch(err => {
            console.error(err.response);
        }); 

      if(response.data.length == 0) {
          return;
      }
      return {data:response.data[0]};
    } catch (err) {
      winstonLogger.error(
      `Problem getting document ID for "${docId}"
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

async function getStrapiSourceBySrcId(srcId) {
    try {
      const query = qs.stringify({
        filters: {
          srcId: {
            $eq: srcId
          },
        },
        populate: {
            xdocsPathIds: {
                populate: '*'
            }
        }
      },
      {
        encodeValuesOnly: true,
      });

      const {data:response} = await axios.get(`${STRAPI_API_URL}/sources?${query}`,
      {
            retry: 5,
            pause: 1000,
            callback: retry => {
              console.log(`Retrying fetch of ${STRAPI_API_URL}/sources`);
            },
      })
      .catch(err => {
            console.error(err.response);
        }); 

      if(response.data.length == 0) {
          return;
      }
      return {data:response.data[0]};
    } catch (err) {
      winstonLogger.error(
      `Problem getting source for "${srcId}"
          ERROR: ${err}`
    );
    }
}

async function postNewDoc(data) {
    try {       
      //console.log(data);
        const reqBody = {"data": data}
        const responseData = await axios.post(`${STRAPI_API_URL}/documents`, reqBody)
        .then((response) => {
          if(!response.data || response.data.length == 0) {
            return;
          } 
          return response.data;
        })
        .catch(err => {
            console.error(`Error posting doc: ${JSON.stringify(data)}`);
            console.error(err.response.data.error.details);
            return;
        });
        return responseData;
        // //console.log({data:response.data});
        // if(!response.data || response.data.length == 0) {
        //   return;
        // }
        //return //{data:response.data};      
        // const {data:response} = await axios.post(`${STRAPI_API_URL}/documents`, reqBody)
        // .catch(err => {
        //     //console.error(err.response);
        //     console.error(err.response.data.error.details);
        // });
        // //console.log({data:response.data});
        // if(!response.data || response.data.length == 0) {
        //   return;
        // }
        // return {data:response.data};
    } catch (err) {
      winstonLogger.error(
      `Problem adding new document
          ERROR: ${err}`
    );
    }
}

async function postNewSource(data) {
    try {       
        const reqBody = {"data": data}      
        const {data:response} = await axios.post(`${STRAPI_API_URL}/sources`, reqBody)
        .catch(err => {
            console.error(`Error posting source: ${JSON.stringify(data)}`);
            console.error(err.response.data.error.details);
        });
        if(response.data.length == 0) {
          return;
        }
        return {data:response.data};
    } catch (err) {
      winstonLogger.error(
      `Problem adding new source
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

async function postNewPage(data) {
    try {
        const reqBody = {"data": data}
        
        const {data:response} = await axios.post(`${STRAPI_API_URL}/pages`, reqBody) 
        .catch(err => {
            console.error(err.response);
            console.error(err.response.data.error.details);
        });     
        //console.log(response);
        return response;   
    } catch (err) {
      winstonLogger.error(
      `Problem adding new page
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

/*
* Unused potential helper functions
* Not needed now, but could be used if we built a separate UI
* rather than the Strapi interface.
*/

// Retrieves a Strapi page title.
async function getPageTitle(url) {
    try {
      const query = qs.stringify({
        fields: ['title'],
        filters: {
          relativeUrl: {
            $eq: url
          },
        }
      },
      {
        encodeValuesOnly: true,
      });

      const response = await fetch(`${STRAPI_API_URL}/pages?${query}`,
      {
            retry: 5,
            pause: 1000,
            callback: retry => {
              console.log(`Retrying fetch of ${STRAPI_API_URL}/pages`);
            },
      });
      if(response.ok) {
        const responseJson = await response.json();
        return responseJson.data[0]?.attributes?.title;
      }
      return;
    } catch (err) {
      winstonLogger.error(
      `Problem getting page title for "${url}"
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

// Updates a Strapi page title.
async function updatePageTitle(id, title) {
    try {
        const reqBody = {
            "data": {
                    "title": title
            }
        }
        
        axios.put(`${STRAPI_API_URL}/pages/${id}`, reqBody
        ).then(async (response) => {
            if(response.status == '200') {               
                //console.log(response.data.data?.attributes?.title);
                return response.data.data?.attributes?.title;
        }
        });     
        return;
    } catch (err) {
      winstonLogger.error(
      `Problem updating page title for page id "${id}"
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

// Retrieves a Strapi source object based on Strapi id.
async function getStrapiSource(id) {
    try {
      const query = qs.stringify({
        filters: {
          srcId: {
            $eq: id
          },
        }
      },
      {
        encodeValuesOnly: true,
      });

      const response = await fetch(`${STRAPI_API_URL}/sources?${query}`,
      {
            retry: 5,
            pause: 1000,
            callback: retry => {
              console.log(`Retrying fetch of ${STRAPI_API_URL}/sources`);
            },
      });
      if(response.ok) {
        const responseJson = await response.json();
        //console.log(responseJson);
        return responseJson.data[0];
      }
      return;
    } catch (err) {
      winstonLogger.error(
      `Problem getting page info for "${url}"
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

// utility functions
function *walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

// Unused functions

// dont think we'll need this
async function getStrapiDocIdByFlailDocId(docId) {
    try {
      const query = qs.stringify({
        fields: ['id'],
        filters: {
          docId: {
            $eq: docId
          },
        }
      },
      {
        encodeValuesOnly: true,
      });

      const {data:response} = await axios.get(`${STRAPI_API_URL}/documents?${query}`,
      {
            retry: 5,
            pause: 1000,
            callback: retry => {
              console.log(`Retrying fetch of ${STRAPI_API_URL}/documents`);
            },
      })
      .catch(err => {
            console.error(err.response);
        }); 
      if(response.data.length == 0) {
          return;
      }
      return {data:response.data[0].id};
    } catch (err) {
      winstonLogger.error(
      `Problem getting document ID for "${docId}"
          ERROR: ${JSON.stringify(err)}`
    );
    }
}

module.exports = { 
    getPageInfo, 
    getPageTitle, 
    updatePageTitle,
    getStrapiDocByDocId,
    getStrapiSourceBySrcId,
    importAllFlailToStrapi,
    importFlailPageToStrapi
};

