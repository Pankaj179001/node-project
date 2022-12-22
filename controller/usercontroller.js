const connection = require('../sql_connector')
class login {

    login_me(req, res) {
        connection.query(`select * from signup where email='${req.body.email}' and password='${req.body.password}'`, (err, result) => {
            if (err) { console.log("query error..,", err) }
            else if (result.length > 0) {
                console.log(result)
                req.session.email = result[0].email
                req.session.name = result[0].name
                req.session.password = result[0].password
                res.redirect('/welcome')
            }
            else {
                res.render('home', { message: "login failed" })
                console.log(result)
            }
        })
    }
    change_password(req, res) {
        if (req.session.password) {
            if (req.method == "POST") {
                if (req.session.password == req.body.old_pass) {
                    console.log("old password perfectly matching")
                    if (req.body.new_pass == req.body.con_pass) {

                        connection.query(`update signup set password=${req.body.new_pass} where password=${req.body.old_pass}`, (err, result) => { err ? console.log("query error<>", err) : console.log(result) })
                        res.redirect('/welcome?value="password changed"')
                    } else {
                        res.render('ch_password', { message: "new password and confirm password are not same" })

                    }
                } else {
                    res.render('ch_password', { message: "old password not matching" })
                }

            }
            else {
                res.render('ch_password', { message: "" })
            }
        }
        else {
            res.redirect('/?message=sign in first')
        }
    }

    signup_user(req,res){
        connection.query(`select * from signup`,(err,result)=>
        {
            err?console.log("query error",err):res.render('signed_user',{message:result})
        })
    }

}




class signup extends login {

    store_user(req, res) {
        if (req.method == "GET") {
            res.render('signup', { message: 0 })
        }
        else {
            var data = req.body
            connection.query(`insert into signup Set? `, data, (err, result) => {
                err ? console.log("query error..,", err) : res.render('signup', { message: "signup successfully" })
                console.log(result)

            })
        }
    }
   
}
const obj = new signup()
module.exports = obj