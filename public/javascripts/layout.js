var updateID = null;

$(window).on("load", function () {
    var bodyHeight = $('body').height();
    var windowHeight = window.innerHeight;
    if (bodyHeight < windowHeight) {
        $('body').height(windowHeight);
        $('body').css('position', 'relative');
        $('#footer').css('position', 'absolute');
        $('#footer').css('bottom', '0');
    }
});

$(document).ready(function () {

    let windowWidth = $(window).width();
    let innerWidth = windowWidth / 5;
    if (innerWidth < 360) {
        innerWidth = 360;
    }
    $("#inner-overlay-div").width(innerWidth);


    $("#sign-out-link").on("click", function () {
        signOut();
    });


    $("#sign-in-link").on("click", function () {
        on1();
        adjustOverlayPosition();
    });

    $(document).on('keydown', function (event) {
        if (event.key == "Escape") {
            if ($('#form-div').is(":visible")) {
                off2()
            } else if ($('#overlay-table').is(":visible")) {
                off1();
            }
        } else if (event.key == "Enter") {
            if ($('#overlay-table').is(":visible")) {
                let text = $("#submit-1").text();

                if (text == "Sign In") {
                    signIn();
                }
            }
        }
    });


    $("#submit-1").click(function () {
        signIn();
    });

});

function on1() {
    document.getElementById("overlay").style.display = "block";
    $("#username").focus();
}

function off1() {
    document.getElementById("overlay").style.display = "none";
}

function on2() {
    document.getElementById("overlay-2").style.display = "block";
}

function off2() {
    document.getElementById("overlay-2").style.display = "none";

    clearFields();
}

function adjustOverlayPosition() {
    let windowHeight = window.innerHeight;
    let overlayHeight = $("#inner-overlay-div").height();
    let difference = windowHeight - overlayHeight;
    let margin = difference / 2;
    $("#overlay").css('padding-top', margin);
}

function adjustOverlay2Position() {
    let windowHeight = window.innerHeight;
    let overlayHeight = $("#form-div").height();
    let difference = windowHeight - overlayHeight;
    let margin = difference / 2;
    $("#overlay-2").css('padding-top', margin);
}

function signIn() {
    let username = $("#username").val();
    let password = $("#password").val();

    let data = {
        Password: password,
        Username: username
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/admin/sign-in", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function (event) {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        } else if (this.readyState == 4 && this.status == 400) {
            alert('Incorrect Credentials');
            event.stopImmediatePropagation();
        } else if (this.readyState == 4 && this.status == 500) {
            //alert('Incorrect Credentials');
        }
    };
    xhttp.send(JSON.stringify(data));
}


function signOut() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/admin/sign-out", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function (event) {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        } else if (this.readyState == 4 && this.status == 500) {
            //alert('Incorrect Credentials');
        }
    };
    xhttp.send();
}


function addDocument(data) {
    if (data) {
        $('#add-div').hide();
        $("#submit").text("");
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/admin/add", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                location.reload();
            } else if (this.status == 500) {
                $("#Display").html("<span style='color:red'><p> Class " + _id + " already exists and cannot be added</p></span>");
            }
        };
        xhttp.send(JSON.stringify(data));
    }
}

function deleteDocument(data) {
    if (data) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "/admin/delete", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                location.reload();
            } else if (this.status == 500) {
            }
        };
        xhttp.send(JSON.stringify(data));
    }
}

function updateDocument(data) {
    if (data) {
        $("#submit").text("");
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/admin/update", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                location.reload();
            } else if (this.status == 500) {
                $("#Display").html("<span style='color:red'><p> Class " + _id + " already exists and cannot be added</p></span>");
            }
        };
        xhttp.send(JSON.stringify(data));
    }
}

function getByNumber(data) {
    if (data) {
        let returnDocument;
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/admin/get-by-number", false);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                returnDocument =  JSON.parse(this.response);
            } else if (this.status == 500) {
                return null;
            }
        };
        xhttp.send(JSON.stringify(data));
        return returnDocument;
    }
}
