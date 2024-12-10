document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');
  const filterRating = document.getElementById('filterRating');

  let allReviews = [];

  // Fetch reviews from the server
  fetch('/api/reviews')
    .then(res => res.json())
    .then(data => {
      allReviews = data;
      displayReviews(allReviews);
    })
    .catch(err => console.error(err));

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const email = document.getElementById('reviewerEmail').value.trim();
    const rating = reviewForm.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('reviewComment').value.trim();

    fetch('/api/reviews', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, rating: parseInt(rating), comment })
    })
    .then(res => res.json())
    .then(newReview => {
      allReviews.unshift(newReview);
      displayReviews(allReviews);
      reviewForm.reset();
    })
    .catch(err => console.error(err));
  });

  filterRating.addEventListener('change', () => {
    const selected = filterRating.value;
    if (selected === 'all') {
      displayReviews(allReviews);
    } else {
      const filtered = allReviews.filter(r => r.rating == selected);
      displayReviews(filtered);
    }
  });

  function displayReviews(data) {
    reviewList.innerHTML = '';
    if (data.length === 0) {
      reviewList.innerHTML = '<p>No reviews yet. Be the first to leave one!</p>';
      return;
    }

    data.forEach(review => {
      let stars = '';
      for (let i = 0; i < review.rating; i++) stars += '★';
      for (let i = review.rating; i < 5; i++) stars += '☆';

      const reviewItem = document.createElement('div');
      reviewItem.classList.add('review-item');
      reviewItem.innerHTML = `
        <div class="review-header">
          <div class="review-name">${review.name} <span style="font-size:12px;color:#999;">(${review.email})</span></div>
          <div class="review-rating">${stars}</div>
        </div>
        <div class="review-comment">${review.comment}</div>
      `;
      reviewList.appendChild(reviewItem);
    });
  }
});
