// display uploaded photo inside the preview avatar
/* eslint-disable no-undef */
$('#profileImage').click((e) => {
  $('#floatingInputAvatar').click();
});

function fasterPreview(uploader) {
  if (uploader.files && uploader.files[0]) {
    $('#profileImage').attr(
      'src',
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      window.URL.createObjectURL(uploader.files[0])
    );
    $('#profileImage').attr('style', 'height: 100px; width: 100px;');
  }
}

$('#floatingInputAvatar').change(function () {
  fasterPreview(this);
});
/// ///////////////////////////////////////////////////////////////////////////

// send request to the server to create a new user
$('#signupForm').submit((e) => {
  e.preventDefault();
  const userData = {
    username: $('#floatingInputUsername').val(),
    firstName: $('#floatingInputFirstname').val(),
    lastName: $('#floatingInputLastname').val(),
    email: $('#floatingInputEmail').val(),
    password: $('#floatingPassword').val(),
    passwordConfirm: $('#floatingPasswordConfirm').val(),
    phone: $('#floatingInputPhone').val(),
  };

  if ($('#floatingInputAvatar').val() !== '') {
    userData.avatar = $('#floatingInputAvatar').val();
  }
  $.ajax({
    url: '/api/auth/signup',
    type: 'POST',
    data: JSON.stringify(userData),
    contentType: 'application/json',
    success: (data) => {
      console.log(data);
    },
    error: (err) => {
      console.log(err);
    },
  });
});
