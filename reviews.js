module.exports = async (req, res) => {
  const blobBaseUrl = 'https://fmlx9dslkdv19ays.public.blob.vercel-storage.com';
  const fileUrl = `${blobBaseUrl}/reviews.json`; 
  // Adjust the URL to match your blob's base URL and desired file name.

  if (req.method === 'GET') {
    // Fetch existing reviews
    let reviews = [];
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        reviews = await response.json();
      } else if (response.status === 404) {
        // No file found means no reviews yet
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

    // Fetch existing reviews
    let reviews = [];
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        reviews = await response.json();
      } else if (response.status === 404) {
        reviews = [];
      } else {
        throw new Error(`Error fetching reviews: ${response.statusText}`);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    // Add new review
    const newReview = {
      id: Date.now(),
      name,
      email,
      rating: parseInt(rating),
      comment,
      replies: []
    };
    reviews.unshift(newReview); // Add to the top

    // Upload updated reviews back to blob storage
    // You must have the VERCEL_BLOB_WRITE_ONLY_TOKEN set in Vercel Environment Variables.
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
        throw new Error(`Error uploading reviews: ${uploadResponse.statusText}`);
      }

      return res.status(200).json(newReview);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
