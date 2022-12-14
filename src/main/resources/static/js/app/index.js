var main = {
    init : function () {
        var _this = this;
        $('#btn-save').on('click', function () {
            _this.save();
        });

        $('#btn-update').on('click', function () {
            _this.update();
        });

        $('#btn-delete').on('click', function () {
            _this.delete();
        });

        // 댓글 저장
        $('#btn-comment-save').on('click', function () {
            _this.commentSave();
        });

        $('#btn-comment-delete').on('click', function () {
            _this.commentDelete(e.target.value);
        })
    },
    save : function () {
        var data = {
            title: $('#title').val(),
            author: $('#author').val(),
            content: $('#content').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/v1/posts',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function() {
            alert('글이 등록되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
    },
    update : function () {
        var data = {
            title: $('#title').val(),
            content: $('#content').val()
        };

        var id = $('#id').val();

        $.ajax({
            type: 'PUT',
            url: '/api/v1/posts/'+id,
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function() {
            alert('글이 수정되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
    },
    delete : function () {
        var id = $('#id').val();

        $.ajax({
            type: 'DELETE',
            url: '/api/v1/posts/'+id,
            dataType: 'json',
            contentType:'application/json; charset=utf-8'
        }).done(function() {
            alert('글이 삭제되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
    },

    /** 댓글 저장 */
    commentSave : function () {
        var anonymous=false;
        if ($('#anonymous').is(":checked")){
            anonymous=true;
        }
        var data = {
            postsId: $('#postsId').val(),
            comment: $('#comment').val(),
            anonymous: anonymous
        }
        console.log(anonymous);

        // 공백 및 빈 문자열 체크
        if (!data.comment || data.comment.trim() === "") {
            alert("공백 또는 입력하지 않은 부분이 있습니다.");
            return false;
        } else {
            $.ajax({
                type: 'POST',
                url: '/api/v1/posts/' + data.postsId + '/comments',
                dataType: 'JSON',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            }).done(function () {
                alert('댓글이 등록되었습니다.');
                window.location.reload();
            }).fail(function (error) {
                alert(JSON.stringify(error));
            });
        }
    },

    commentDelete : function (commentId,commentUserId) {
        var data = {
            postsId: $('#postsId').val(),
            commentId: commentId,
            commentUserId: commentUserId,
            sessionUserId: $('#sessionUserId').val()
        }
        console.log("commentUserId : " + data.commentUserId);
        console.log("sessionUserId : " + data.sessionUserId);
        console.log()

        if (data.commentUserId==data.sessionUserId) {
            $.ajax({
                type: 'DELETE',
                url: '/api/v1/posts/'+ data.postsId + '/comments/'+commentId,
                dataType: 'json',
                contentType:'application/json; charset=utf-8'
            }).done(function() {
                alert('댓글이 삭제되었습니다.');
                window.location.reload();
            }).fail(function (error) {
                alert(JSON.stringify(error));
            });
        }
        else if(data.commentUserId==0){
            alert("익명 댓글은 삭제할 수 없습니다.");
        }
        else{
            alert("본인이 작성한 댓글만 삭제 가능합니다.");
        }

    },
};

main.init();