// scripts.js

document.addEventListener("DOMContentLoaded", () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewList = document.getElementById('reviewList');
    const filterRating = document.getElementById('filterRating');

    // Load reviews from localStorage or initialize empty array
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    // Display reviews initially
    displayReviews(reviews);

    // Add review form submission event
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewerName').value.trim();
        const email = document.getElementById('reviewerEmail').value.trim();
        const rating = reviewForm.querySelector('input[name="rating"]:checked').value;
        const comment = document.getElementById('reviewComment').value.trim();

        if(name && email && rating && comment) {
            const newReview = {
                id: Date.now(),
                name: name,
                email: email,
                rating: parseInt(rating),
                comment: comment,
                replies: []
            };

            reviews.push(newReview);
            localStorage.setItem('reviews', JSON.stringify(reviews));

            // Clear form
            reviewForm.reset();

            // Refresh display
            displayReviews(reviews);
        }
    });

    // Filter reviews by rating
    filterRating.addEventListener('change', () => {
        const selected = filterRating.value;
        if (selected === 'all') {
            displayReviews(reviews);
        } else {
            const filtered = reviews.filter(r => r.rating === parseInt(selected));
            displayReviews(filtered);
        }
    });

    // Handle reply form submissions (event delegation)
    reviewList.addEventListener('click', (e) => {
        // Show or hide reply form
        if (e.target.classList.contains('reply-button')) {
            const parentId = e.target.dataset.id;
            const form = document.getElementById(`replyForm-${parentId}`);
            if (form) {
                form.classList.toggle('show');
            }
        }

        // Submit reply
        if (e.target.classList.contains('submit-reply')) {
            const parentId = e.target.dataset.id;
            const replyName = document.querySelector(`#replyForm-${parentId} input[name="replyName"]`).value.trim();
            const replyEmail = document.querySelector(`#replyForm-${parentId} input[name="replyEmail"]`).value.trim();
            const replyComment = document.querySelector(`#replyForm-${parentId} textarea[name="replyComment"]`).value.trim();

            if (replyName && replyEmail && replyComment) {
                // Find the review to reply to
                const reviewIndex = reviews.findIndex(r => r.id === parseInt(parentId));
                if (reviewIndex !== -1) {
                    const reply = {
                        id: Date.now(),
                        name: replyName,
                        email: replyEmail,
                        comment: replyComment
                    };
                    reviews[reviewIndex].replies.push(reply);
                    localStorage.setItem('reviews', JSON.stringify(reviews));
                    displayReviews(reviews);

                    // Reset form and hide it
                    document.getElementById(`replyForm-${parentId}`).reset();
                    document.getElementById(`replyForm-${parentId}`).classList.remove('show');
                }
            }
        }
    });

    function displayReviews(data) {
        reviewList.innerHTML = '';
        if (data.length === 0) {
            reviewList.innerHTML = '<p>No reviews yet. Be the first to leave one!</p>';
            return;
        }

        data.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');

            // Create star rating string
            let stars = '';
            for (let i = 0; i < review.rating; i++) {
                stars += '★';
            }
            for (let i = review.rating; i < 5; i++) {
                stars += '☆';
            }

            reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="review-name">${review.name} <span style="font-size:12px;color:#999;">(${review.email})</span></div>
                    <div class="review-rating">${stars}</div>
                </div>
                <div class="review-comment">${review.comment}</div>
                <a href="javascript:void(0)" class="reply-button" data-id="${review.id}">Reply</a>
                <form class="reply-form" id="replyForm-${review.id}">
                    <label>Name</label>
                    <input type="text" name="replyName" required>
                    <label>Email</label>
                    <input type="email" name="replyEmail" required>
                    <label>Comment</label>
                    <textarea name="replyComment" rows="2" required></textarea>
                    <button type="button" class="submit-reply" data-id="${review.id}">Submit Reply</button>
                </form>
            `;

            if (review.replies && review.replies.length > 0) {
                const repliesContainer = document.createElement('div');
                repliesContainer.classList.add('review-replies');

                review.replies.forEach(rep => {
                    const replyItem = document.createElement('div');
                    replyItem.classList.add('reply-item');
                    replyItem.innerHTML = `
                        <div class="reply-header">${rep.name} <span style="font-size:12px;color:#999;">(${rep.email})</span></div>
                        <div class="reply-comment">${rep.comment}</div>
                    `;
                    repliesContainer.appendChild(replyItem);
                });

                reviewItem.appendChild(repliesContainer);
            }

            reviewList.appendChild(reviewItem);
        });
    }
});
