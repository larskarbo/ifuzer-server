const express = require('express')
const app = express()
const port = 3015
var cors = require('cors')
var ig = require('instagram-scraping')
const instagram = require('user-instagram')

const stripe = require('stripe')('sk_test_CAkJIvCt5VhT8jz9iNDGflKm003LJPoncK')
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
    const { description, posts, amount } = req.body
    console.log('posts: ', posts)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        payment_intent_data: {
            metadata: {
                images: posts.map(p => p.shortcode).join(','),
                likesInTotal: 'xxx'
            }
        },
        line_items: [
            {
                name: 'xxx likes for ' + posts.length + ' images',
                images: [
                    'https://www.ifuzer.com/wp-content/uploads/2019/11/bluelike.png'
                ],
                amount: amount,
                currency: 'usd',
                quantity: 1
            }
        ],
        success_url:
            'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel'
    })
    console.log('session: ', session)
    res.json(session)
})

app.get('/ig/:user', async (req, res) => {
    // ig.scrapeUserPage('fjordnature_com').then(result => {
    //   console.dir(result);
    //   res.json(result);
    // });

    instagram('https://www.instagram.com/' + req.params.user)
        .then(data => {
            console.log(`Full name is: ${data.fullName}`)
            res.json(data)
        })
        .catch(e => {
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
