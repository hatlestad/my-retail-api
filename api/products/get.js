import axios from 'axios';
import _get from 'lodash/get';

import * as common from '../lib/common';
import * as dataStore from '../lib/dataStore';

import '@babel/polyfill';

const REDSKY_EXCLUDES = 'taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,available_to_promise_network';

export default async function getProduct(req, res) {
  const id = req.params.id;
  let data = {};

  // Validate id is a valid TCIN
  if (!common.isValidProductId(id)) {  
    return res.status(400).json({ error: 'Invalid product id provided in the path.' });
  }

  // Lookup id in firebase store and retrieve the data
  try {
    data = await dataStore.getDocFromCollection('products', id);
    if (!data) {
      return res.status(404).json({ error: 'Unable to find requested product id.' });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: 'Unable to retrieve product details from data store.' });
  }

  // Call redsky GET to retrieve product name
  try {
    const response = await axios.get(`https://redsky.target.com/v2/pdp/tcin/${id}`, { params: { excludes: REDSKY_EXCLUDES }});
    data.name = _get(response, 'data.product.item.product_description.title', '');
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: 'Unable to retrieve product name from product catalog.' });
  }

  // Return success response
  return res.status(200).send(data);
}