class FeatureExtractionPipeline {
  static task = 'feature-extraction';
  static model = 'all-MiniLM-L6-v2';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Dynamically import the Transformers.js library
      let { pipeline, env } = await import('@xenova/transformers');
      env.allowRemoteModels = false;
      env.localModelPath = process.env.MODEL_ABS_PATH;
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

FeatureExtractionPipeline.getInstance();

export async function createVectorFromText(text) {
  const extractor = await FeatureExtractionPipeline.getInstance();
  if (extractor) {
    return await extractor(text);
  }
  return null;
}
