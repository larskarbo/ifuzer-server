
const instagram = require('user-instagram')

instagram('https://www.instagram.com/eminem')
.then(data => {
    console.log(`Full name is: ${data.fullName}`)
})
.catch(e => {
    console.log('e: ', e);
    // Error will trigger if the account link provided is false.
    // console.log(e.message)
})