import https from 'https';

// GET
// https://api.yelp.com/v3/businesses/a8gk25_MTKdtoOwBsiraDQ
// HEADERS
//    Authorization: Bearer iCc5e5KyLW6OQitdmTMSLk53WmKl5AytoKywhcSCdwG3a2_kexCyIe_Sn4OCLXnKR58kIpQ3mvfr9gD7C2qkFGl92gSFxdEhCWT8XFoYJRUQ627DADQwMJuMAkhJXnYx

const secretId: string = 'iCc5e5KyLW6OQitdmTMSLk53WmKl5AytoKywhcSCdwG3a2_kexCyIe_Sn4OCLXnKR58kIpQ3mvfr9gD7C2qkFGl92gSFxdEhCWT8XFoYJRUQ627DADQwMJuMAkhJXnYx';

export function fetchYelpBusinessDetails(): Promise<any> {

  const endPoint: string = 'businesses/a8gk25_MTKdtoOwBsiraDQ';

  return new Promise((resolve, reject) => {
    const options: any = {
      host: 'api.yelp.com',
      path: '/v3/' + endPoint,
      port: 443,
      headers: {
        Authorization: 'Bearer ' + secretId,
      },
    };

    let str = '';

    https.get(options, (res) => {
      res.on('data', (d) => {
        str += d;
      });
      res.on('end', () => {
        const data = JSON.parse(str);
        resolve(data);
      });

    }).on('error', (err) => {
      console.log('Caught exception: ' + err);
      reject(err);
    });
  });

}

export function fetchYelpBusinessByLocation(): Promise<any> {

  const endPoint: string = 'businesses/search?latitude=37.380421&longitude=-122.115631';

  return new Promise((resolve, reject) => {
    const options: any = {
      host: 'api.yelp.com',
      path: '/v3/' + endPoint,
      port: 443,
      headers: {
        Authorization: 'Bearer ' + secretId,
      },
    };

    let str = '';

    https.get(options, (res) => {
      res.on('data', (d) => {
        str += d;
      });
      res.on('end', () => {
        const data = JSON.parse(str);
        resolve(data);
      });

    }).on('error', (err) => {
      console.log('Caught exception: ' + err);
      reject(err);
    });
  });
}