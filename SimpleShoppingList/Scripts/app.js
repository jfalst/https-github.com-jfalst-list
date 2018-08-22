var currentList = {};

function CreateShoppingList() {
    currentList.name = $("#ShoppingListName").val();

    currentList.items = new Array();
    

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ShoppingListsEF/",
        data: currentList,
        success: function (result) {
            currentList = result;
            showShoppingList();
            history.pushState({id: result.id}, result.name, "?id=" + result.id);
            
        }


    });



    showShoppingList();

}
function showShoppingList() {
    $("#ShoppingListTitle").html(currentList.name);
    $("#ShoppingListItems").empty();

    $("#createListDiv").hide();

    $("#ShoppingListDiv").show();

    $("#newItemName").val("");

    $("#newItemName").focus();
    $("#newItemName").unbind("keyup");
    $("#newItemName").keyup(function (event) {

        if (event.keyCode === 13) {
            addItem();
        }

    });
}

function addItem() {

    var newItem = {};

    newItem.name = $("#newItemName").val();

    newItem.shoppingListId = currentList.id;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ItemsEF/",
        data: newItem,
        success: function (result) {

            currentList = result;

            drawItems();
            $("#newItemName").val("");

        }


    });

   
}

function drawItems() {

    var $list = $("#ShoppingListItems").empty();

    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html(currentItem.name)
            .attr("id", "item_" + i);
        var $deleteBttn =
            $("<button onclick='deleteItem(" + currentItem.id + " )'>D</button>").appendTo($li);
        var $checkBttn = $("<button onclick='checkItem(" + currentItem.id + ")'>C</button>").appendTo($li);

        if (currentItem.checked) {
            $li.addClass("checked");
        }
        $li.appendTo($list);

    }
}

function deleteItem(itemId) {

    $.ajax({
        type: "Delete",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
      
        success: function (result) {

            currentList = result;

            drawItems();

        }


    });
}

function checkItem(itemId) {

    var changedItem = {};

    for (var i = 0; i < currentList.items.length; i++) {
        if (currentList.items[i].id === itemId) {
            changedItem = currentList.items[i];
        }
        changedItem.checked = !changedItem.checked;
    }

    $.ajax({
        type: "PUT",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        data: changedItem,
        success: function(result) {

            changedItemt = result;

            drawItems();
          
        }


    });


}

function getShoppingListById(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "api/ShoppingListsEF/" + id,
        success: function(result) {
            currentList = result;
            showShoppingList();
            drawItems();
        }
        

});
}

function hideShoppingList() {

    $("#createListDiv").show();

    $("#ShoppingListDiv").hide();

    $("#ShoppingListName").val("");

    $("#ShoppingListName").focus();
    $("#ShoppingListName").unbind("keyup");
    $("#ShoppingListName").keyup(function (event) {

        if (event.keyCode === 13) {
            CreateShoppingList();
        }

    });

}

$(document).ready(function () {

    console.info("ready");

    hideShoppingList();

    $("#ShoppingListName").focus();
    $("#ShoppingListName").keyup(function (event) {

        if (event.keyCode === 13) {
            CreateShoppingList();
        }

    });



    var pageUrl = window.location.href;
    var idIndex = pageUrl.indexOf("?id=");

    if (idIndex !== -1) {
        getShoppingListById(pageUrl.substring(idIndex + 4));
    }

    window.onpopstate = function(event) {
        if (event.state == null) {
            
            hideShoppingList();

        } else {
            getShoppingListById(event.state.id);
        }
    };
});