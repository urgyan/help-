class PostComments{constructor(e){this.postId=e,this.postContainer=$("#post-"+e),this.newCommentForm=$("#new-comment-form-"+e),this.createComment(e);let t=this;$(" .delete-comment-button",this.postContainer).each((function(){t.deleteComment($(this))}))}createComment(e){let t=this;this.newCommentForm.submit((function(n){n.preventDefault();$.ajax({type:"post",url:"/comment/create",data:$(this).serialize(),success:function(n){let o=t.newCommentDom(n.data.comment);$(".post-comment-list #post-comments-"+e).prepend(o),t.deleteComment($(" .delete-comment-button",o)),new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Comment published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})}))}newCommentDom(e){return $(`\n        \n                <li id="comment-${e._id}">\n    \n\n                    <div class="comment-container1">\n                        <div class="header1">\n                            <div class="left-part1">\n                                \n                                <img src=${e.user.avatar}>\n                                <h6>${e.user.name}</h6>\n                            </div>\n                            <div class="right-part1">\n          \n                                <small>\n                                    <a class="delete-comment-button" href="/comment/destroy/${e._id}">\n                                        <i class="fas fa-times-circle"></i>\n                                    </a>\n                                </small>\n\n                            </div>\n                        </div>\n\n                        <div class="comment-content1">\n                            <p>\n                                ${e.content}\n                            </p>\n                        </div>\n                            \n                        <div class="footer1">\n                \n                            <a class="toggle-like-button red" data-likes="${e.likes.length}" href="/likes/toggle/?id=${e._id}&type=Comment">\n                                <i class="far fa-lg fa-thumbs-up">\n                                    ${e.likes.length}\n                                </i>\n                            </a>\n              \n                        </div>\n            \n                    </div>\n\n                </li>\n        \n        `)}deleteComment(e){$(e).click((function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(e){$("#comment-"+e.data.comment_id).remove(),new Noty({theme:"relax",text:"Comment Deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})}))}}