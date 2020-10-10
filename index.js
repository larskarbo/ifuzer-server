const express = require('express')
const app = express()
const port = 3015
var cors = require('cors')
const instagram = require('user-instagram')

const stripe = require('stripe')(process.env.IFUZER_STRIPE_API)
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true
    })
)

app.post('/checkout', async (req, res) => {
    const { description, posts, likes, amount } = req.body
    console.log('description: ', description);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        payment_intent_data: {
            metadata: {
                images: posts.map(p => p.shortcode).join(','),
                likesInTotal: likes
            }
        },
        line_items: [
            {
                name: likes + ' likes for ' + posts.length + ' images',
                images: [
                    'https://www.ifuzer.com/wp-content/uploads/2019/11/bluelike.png'
                ],
                amount: amount,
                currency: 'usd',
                quantity: 1
            }
        ],

        success_url: 'https://www.ifuzer.com/thank-you/',
        cancel_url: 'https://www.ifuzer.com/buy-instagram-likes/'
    })
    console.log('session: ', session)
    res.json(session)
})

app.get('/ig/:user', async (req, res) => {
    // ig.scrapeUserPage('fjordnature_com').then(result => {
    //   console.dir(result);
    //   res.json(result);
    // });
    console.log("hei: ", req.params.user)
    instagram('https://www.instagram.com/' + req.params.user)
        .then(data => {
            console.log(`Full name is: ${data.fullName}`)
            res.json(data)
        })
        .catch(e => {
            console.log('e: ', e);
            // Error will trigger if the account link provided is false.
            res.status(200).send({
                isError: true,
                message: 'Username not found!',
                error: e
            })
            // console.log(e.message)
        })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
