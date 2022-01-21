class ChatEngine{
    constructor(chatBoxID,userEmail){
        this.chatBoxID = $(`#${chatBoxID}`);
        this.userEmail = userEmail;


        //Initiate the connection
        this.socket = io.connect('http://54.234.238.70:5000',{ transports : ['websocket'] });

        if(this.userEmail){
            this.connectionHandler();
        }

    }

    //Creating an event handler for handling the connection
    connectionHandler(){

        let self = this;

        this.socket.on('connect',function(){
            console.log("Connection established using sockets...!!");
        });

        self.socket.emit('join_room',{
            user_email:self.userEmail,
            chatroom:'chatter'

        });

        self.socket.on('user_joined',function(data){
            console.log('a user joined' , data);
        });


        //handle how send and receive message
        $('#send-message').click(function(){
            console.log('clicker')
            let msg = $('#chat-message-input').val();
            console.log(msg);
            if(msg!= ''){
                //send or emit that message to the server
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatroom:'chatter'
                });
            }
        });

        //Receiving the message
        self.socket.on('receive_message',function(data){
            console.log('message received',data);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if(self.userEmail == data.user_email){
                messageType = 'self-message'
            
            }

            newMessage.append($('<p>',{
                'html':data.user_email
            }));
            newMessage.append($('<span>',{
                'html':data.message
            }));

            

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })

    }

}