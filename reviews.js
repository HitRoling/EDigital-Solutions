const blobBaseUrl = 'https://fmlx9dslkdv19ays.public.blob.vercel-storage.com'; // Replace with your base URL
const fileUrl = `${blobBaseUrl}/reviews.json`; 

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    let reviews = [];
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        reviews = await response.json();
      } else if (response.status === 404) {
        // No reviews.json file yet, so no reviews
        reviews = [];
      } else {
        throw new Error(`Error fetching reviews: ${response.statusText}`);
      }
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { name, email, rating, comment } = req.body;
    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    let reviews = [];
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        reviews = await response.json();
      } else if (response.status === 404) {
        reviews = [];
      } else {
        throw new Error(`Error fetching current reviews: ${response.statusText}`);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    const newReview = {
      id: Date.now(),
      name,
      email,
      rating: parseInt(rating),
      comment,
      replies: []
    };
    reviews.unshift(newReview);

    try {
      const uploadResponse = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VERCEL_BLOB_WRITE_ONLY_TOKEN}`
        },
        body: JSON.stringify(reviews)
      });

      if (!uploadResponse.ok) {
        throw new Error(`Error uploading updated reviews: ${uploadResponse.statusText}`);
      }

      return res.status(200).json(newReview);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
