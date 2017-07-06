var express = require('express');
var router = express.Router({caseSensitive: true, strict:true});
var fetch = require('node-fetch');

const Rx = require('@reactivex/rxjs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');

    // Solution1: use promise
    fetch('http://jsonplaceholder.typicode.com/users/')
        .then(function(res){
          return res.json(); // [object Promise]
        }).then(function(json){
          //console.log(json);

          res.render("users", { users: json });
        }).catch(function(err) {
          console.log(err);
          res.render("error", { message: 'some error happens', error:{
              status: 505,
              stack: 'Some stack information'
          }});
    });

    //Solution2: use Reactive Programming --- with fetch
    let responseStream = Rx.Observable.create(function(observer){
        fetch('http://jsonplaceholder.typicode.com/users/')
            .then(function (res) {
            console.log("Samuel Test res = " + res); //[object Object]
            // you can't call res.json() twice. in that case:
            // Error: body used already for: http://jsonplaceholder.typicode.com/users/

            //console.log("Samuel Test res.json = " + res.json()); //[object Promise]
            return res.json();
        }).then(function (json) {
            console.log("Samuel Test json = " + json);
            observer.next(json);
        }).catch(function (err) {
            console.log(err);
            observer.error(err);
        });
    });

    responseStream.subscribe(function (data) {
        res.render("users", { users: data });
    },function (err) {
        res.render("error", { message: 'some error happens', error:{
            status: 505,
            stack: 'Some stack information'
        }});
    });

    // Solution3: use Async/Await ---- await need a promise
    async function main() {
        try {
            const data = await fetch('http://jsonplaceholder.typicode.com/users/').then(function (res) {
                return res.json();// this is a promise
            });

            console.log("Samuel json = " + data);
            res.render("users", { users: data});
        } catch (err) {
            res.render("error", { message: 'some error happens', error:{
                status: 505,
                stack: 'Some stack information'
            }});
        }
    }

    main();
});

module.exports = router;

