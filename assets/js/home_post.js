{   
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/post/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    // console.log(data);
                    // call the create comment class
                    new PostComments(data.data.post._id);
                    new ToggleLike($(' .toggle-like-button', newPost));
                    new Noty({
                        theme:'relax',
                        text: `Post published`,
                        type:'success',
                        layout:'topRight',
                        timeout: 1500
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">


                    <div class="post-container">
                        <div class="header">
                            <div class="left-part">
                                <img src="${post.user.avatar}">
                                <h5 >${ post.user.name }</h5>
                               
                            </div>
                            <div class="right-part">
                                
                                <a class="delete-post-button" href="/post/destroy/${post._id}">
                                    <i class="fas fa-times-circle"></i>
                                </a>
                       
                            </div>
                
                        </div>
                
                        <div class="post-content">
                            <p>
                            ${ post.content }
                            </p>
                        </div>
                
                        <div class="footer">
                           
                        <a class="toggle-like-button red" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
                            <i class="far fa-lg fa-thumbs-up">
                                0
                            </i>
                        </a>
                                                    
                            <i class="fas fa-lg fa-comments"></i>

                        </div>
                    </div>
                
                    <div class="comment-container">
                        <div class="post-comments">
                        
                            <form action="/comment/create" method="post" id="new-comment-form-${post._id}">
                                <input id="add-comment" type="text" name="content" placeholder="Type here to add comment ...." required>
                                <input type="hidden" name="post" value="${post._id}">
                                <input id="add-button" type="submit" value="Add comment">
            
                            </form>
                     
                        </div>
                
                        <div class="post-comment-list">
                            <ul id="post-comments-${post._id}">
                               
                            </ul>
                        </div>
                    </div>
    
        
        
        
        `)
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
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



    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#post-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);
            
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}