import * as common from '../lib/common';
import * as dataStore from '../lib/dataStore';

import '@babel/polyfill';

export default async function putProduct(req, res) {
  const id = req.params.id;

  // Validate id is a number
  if (!common.isValidProductId(id)) {  
    return res.status(400).json({ error: 'Invalid product id provided in the path.' });
  }

  // Update price in firebase store for id
  try {
    const dataToUpdate = { "current_price.value": req.body.current_price.value };
    const result = await dataStore.updateDocOnCollection('products', id, dataToUpdate);
    if (result && result.code && result.code > 0) {
      // Note: There are 15 error codes provided by Firestore
      // 0 is OK (200), hence ignoring it
      // Assuming all other error codes are NOT FOUND to reduce the complexity of this code example
      return res.status(404).json({ error: 'Unable to locate the product record. Record was not updated.' });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: 'Unable to update price on product.' });
  }

  // Return success response
  return res.status(200).send(req.body);
}