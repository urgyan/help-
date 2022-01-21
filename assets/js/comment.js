// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#new-comment-form-${postId}`);

        this.createComment(postId);
       
        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;
          
            $.ajax({
                type: 'post',
                url: '/comment/create',
                data: $(self).serialize(),
                success: function(data){
                        

                    let newComment = pSelf.newCommentDom(data.data.comment);
                 
                    $(`.post-comment-list #post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));
                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`
        
                <li id="comment-${comment._id}">
    

                    <div class="comment-container1">
                        <div class="header1">
                            <div class="left-part1">
                                
                                <img src=${comment.user.avatar}>
                                <h6>${comment.user.name}</h6>
                            </div>
                            <div class="right-part1">
          
                                <small>
                                    <a class="delete-comment-button" href="/comment/destroy/${comment._id}">
                                        <i class="fas fa-times-circle"></i>
                                    </a>
                                </small>

                            </div>
                        </div>

                        <div class="comment-content1">
                            <p>
                                ${comment.content}
                            </p>
                        </div>
                            
                        <div class="footer1">
                
                            <a class="toggle-like-button red" data-likes="${comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                <i class="far fa-lg fa-thumbs-up">
                                    ${comment.likes.length}
                                </i>
                            </a>
              
                        </div>
            
                    </div>

                </li>
        
        `);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}