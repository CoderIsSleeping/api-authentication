const sendEmail = async(
    to,
    subject,
    text
)=>{


    console.log(
        "============ EMAIL ============"
    );


    console.log(
        "TO:",
        to
    );


    console.log(
        "SUBJECT:",
        subject
    );


    console.log(
        "MESSAGE:",
        text
    );


    console.log(
        "==============================="
    );


};



module.exports={
    sendEmail
};