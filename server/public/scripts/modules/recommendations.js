import '../../stylesheets/modules/recommendations.css';

export async function showTopicRecommendations() {
  const response = await fetch(
    `/recommendations?topicId=${window.location.pathname}`
  );
  if (response.ok) {
    const json = await response.json();
    const recommendedTopics = json.recommendations;
    const recommendationsContainer = document.createElement('div');
    recommendationsContainer.setAttribute('class', 'recommendations');
    recommendationsContainer.innerHTML = `
      <span>Recommended topics</span>
      <ul id="recommendedTopics"></ul>
      `;

    const feedbackContainer = document.querySelector('.feedback');
    const topicBody = document.querySelector('article');
    if (feedbackContainer) {
      feedbackContainer.parentElement.insertBefore(
        recommendationsContainer,
        feedbackContainer
      );
    } else if (topicBody) {
      topicBody.appendChild(recommendationsContainer);
    }
    const recommendedTopicsList = document.getElementById('recommendedTopics');
    for (const topic of recommendedTopics) {
      const recommendedTopicListItem = document.createElement('li');
      const recommendedTopicLink = document.createElement('a');
      recommendedTopicLink.setAttribute('href', topic.id);
      recommendedTopicLink.innerText = topic.title;
      recommendedTopicListItem.appendChild(recommendedTopicLink);
      recommendedTopicsList.appendChild(recommendedTopicListItem);
    }
  }
}
