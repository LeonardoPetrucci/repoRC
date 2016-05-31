var amqp = require('amqplib/callback_api');

//tweet entro un certo raggio -> notifica

module.exports = {

    consume: function consume(screenname, callback) {

        // Consumer
        amqp.connect('amqp://localhost', function (err, conn) {
            if (err != null) {
                console.warn(err.stack);
                console.error(err);
                process.exit;
            }
            conn.createChannel(channel);
            function channel(err, ch) {
                if (err != null) {
                    console.warn(err.stack);
                    console.error(err);
                    process.exit;
                }

                ch.assertQueue(screenname);
                ch.consume(screenname, function(msg) {
                    callback(msg.content.toString()); // i pass it as a callback parameter
                    ch.ack(msg);
                });
            }
        });
    },

    publish: function publish(screenname, tweet) {

        amqp.connect('amqp://localhost', function (err, conn) {
            if (err != null) {
                console.warn(err.stack);
                console.error(err);
                process.exit;
            }
            conn.createChannel(channel);

            function channel(err, ch) {

                if (err != null) {
                    console.warn(err.stack);
                    console.error(err);
                    process.exit;
                }

                var msg = tweet.user.name + ": " + tweet.text;
                ch.assertQueue(screenname, { durable: true });
                ch.sendToQueue(screenname, new Buffer(msg), { persistent: true });
            }
        });
    }
}
