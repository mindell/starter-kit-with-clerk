import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const apiToken = process.env.STRAPI_API_TOKEN;

export  async function fetchArticle(slug:string) {
  // Axios (or fetch) GET request
  const response = await axios.get(`${apiUrl}/api/articles`, {
    params: {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: '*' 
    },
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });
  console.log('fetch article', response.data.data[0]);
  return response.data.data[0];
}

export async function fetchPlans() {
  // Axios (or fetch) GET request
  const response = await axios.get(`${apiUrl}/api/plans`, {
    params: {
      populate: '*' 
    },
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });
  console.log('plans', response.data.data);
  return response.data.data;
}
