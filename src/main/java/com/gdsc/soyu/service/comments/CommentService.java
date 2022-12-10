package com.gdsc.soyu.service.comments;

import com.gdsc.soyu.config.auth.dto.SessionUser;
import com.gdsc.soyu.domain.comment.Comment;
import com.gdsc.soyu.domain.comment.CommentRepository;
import com.gdsc.soyu.domain.posts.Posts;
import com.gdsc.soyu.domain.posts.PostsRepository;
import com.gdsc.soyu.domain.user.User;
import com.gdsc.soyu.domain.user.UserRepository;
import com.gdsc.soyu.web.dto.CommentResponseDto;
import com.gdsc.soyu.web.dto.CommentSaveRequestDto;
import com.gdsc.soyu.web.dto.PostsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.net.URLEncoder;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostsRepository postsRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long save(CommentSaveRequestDto requestDto, Long postId, String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        Posts posts=postsRepository.findById(postId).orElseThrow(()->
                new IllegalArgumentException("댓글 쓰기 실패: 해당 게시글이 존재하지 않습니다."+postId));

        requestDto.setUser(userOptional.get());
        requestDto.setPosts(posts);
        requestDto.setUserName(requestDto.getUser().getName());

        Comment comment=requestDto.toEntity();
        commentRepository.save(comment);

        return comment.getId();
    }

    /* DELETE */
    @Transactional
    public void delete(HttpServletResponse response, SessionUser loginUser, Long commentId) throws IOException {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() ->
                new IllegalArgumentException("해당 댓글이 존재하지 않습니다. id=" + commentId));

        response.setContentType("application/json; charset=utf-8");
        PrintWriter out = response.getWriter();

        if (comment.getUser().getEmail().equals(loginUser.getEmail())){
            commentRepository.delete(comment);

            out.println("<script>alert('댓글이 삭제되었습니다.'); </script>");
            out.flush();
        }
        else {
            out.println("<script>alert('댓글 삭제 권한이 없습니다.'); </script>");
            out.flush();
        }
    }

}