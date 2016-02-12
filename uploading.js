const API_ENDPOINT = 'https://api.dripr.io/upload/anon';

export default function uploadImage(uri, onProgress) {
  const xhr = new XMLHttpRequest();

	const data = new FormData();
	var self = this;
	data.append('file', { uri: uri, name: uri});
	xhr.open('POST', API_ENDPOINT);
	xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      onProgress(e.loaded / e.total)
    }
  }
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
  		if (xhr.readyState === xhr.DONE) {
  			console.log('Request status =', xhr.status);
        console.log('Response text=', xhr.responseText)
  			if (xhr.status === 200) {
  				resolve(JSON.parse(xhr.responseText));
  			} else if (xhr.status !== 0) {
          reject(xhr.responseText)
    		}
  		}
  	};
    xhr.send(data);
  })

}
