const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
const PIXABAY_API_URL = 'https://pixabay.com/api/';

// function to abstract our API request to pixabay
export async function getImageForFood(foodName) {
  try {
    const response = await fetch(`${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(foodName)}&image_type=photo&per_page=3`);
    const data = await response.json();
    return data.hits.length > 0 ? data.hits[0].webformatURL : null;
  } catch (error) {
    console.error('Error fetching food image:', error);
    return null;
  }
}