async function insertSurveyLink() {
  const header = document.querySelector('header');

  const row = document.createElement('div');
  row.className = 'row';

  const col = document.createElement('div');
  col.className = 'col';

  const surveyWrapper = document.createElement('div');
  surveyWrapper.className = 'surveyWrapper';

  const surveyTextWrapper = document.createElement('div');
  surveyTextWrapper.className = 'surveyTextWrapper';
  surveyTextWrapper.innerText = 'Help us improve our product documentation by taking this short survey.';

  const surveyLinkWrapper = document.createElement('div');
  surveyLinkWrapper.className = 'surveyLinkWrapper';

  const link = document.createElement('a');
  link.innerText = 'Click here to take the survey.';
  link.setAttribute('href', '#');

  await fetch('/userInformation')
    .then(result => result.json())
    .then(userInfo => {
      const isEmployee = userInfo.hasGuidewireEmail;
      if (isEmployee) {
        link.setAttribute(
          'href',
          'https://www.surveymonkey.com/r/gwre-docsurvey-internal'
        );
      } else {
        link.setAttribute(
          'href',
          'https://www.surveymonkey.com/r/gwre-docsurvey-external'
        );
      }

      if (userInfo.isLoggedIn) {
        surveyLinkWrapper.append(link);
        surveyWrapper.append(surveyTextWrapper);
        surveyWrapper.append(surveyLinkWrapper);
        col.append(surveyWrapper);
        row.appendChild(col);
        header.appendChild(row);
      }
    })
    .catch(err =>
      console.log('Something went wrong with the survey link', err)
    );
}

insertSurveyLink();
