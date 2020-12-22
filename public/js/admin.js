const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value

  const productElement = btn.closest('article')

  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
  .then(result => {
    return result.json()
  })
  .then(data => {
    productElement.parentNode.removeChild(productElement)
  })
  .catch(err => {
    console.log(result)
  })
}

const deleteBtn = document.querySelector('.card__actions button');
deleteBtn.addEventListener('click', () => deleteProduct(deleteBtn));

// const imageUploadBtn = document.querySelector('#image')
// console.log('imagebutton', imageUploadBtn)

// const initUpload = () => {
//   const files = document.getElementById('image').files;
//   console.log('files', files)
//   const file = files[0];
//   if(file == null){
//   return alert('No file selected.');
//   }
//   getSignedRequest(file);
// }