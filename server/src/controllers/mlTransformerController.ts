class FeatureExtractionPipeline {
  static task = 'feature-extraction';
  static model = 'all-MiniLM-L6-v2';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Dynamically import the Transformers.js library
      // By default, all import statements are converted to require during compilation.
      //   the two lines below delay the import until after compilation.
      //   https://stackoverflow.com/questions/76883048/err-require-esm-for-import-with-xenova-transformers
      let TransformersApi = Function('return import("@xenova/transformers")')();
      let { pipeline, env } = await TransformersApi;
      env.allowRemoteModels = false;
      env.localModelPath = process.env.MODEL_ABS_PATH;
      // @ts-ignore
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

export async function createVectorFromText(text: string) {
  const extractor = await FeatureExtractionPipeline.getInstance();
  if (extractor) {
    // @ts-ignore
    return await extractor(text);
  }
  return null;
}
