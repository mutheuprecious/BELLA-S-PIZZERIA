let pizzaOrders = [];

function Pizza(size, crust, meat ,toppings){
    this.size = size;
    this.crust = crust;
    this.meat = meat;
    this.toppings = toppings;

    this.price;
}

priceToppingsLarge = {
  "large": 800,
  "crispy": 200,
  "stuffed": 300,
  "glutenfree": 400,
  "chicken": 200,
  "beef": 200,
  "chevon": 200,
  "peppers": 200,
  "onions": 150,
  "olives": 250,
  "pineapples": 200,
}
priceToppingsMedium = {
  "medium" :600,
  "crispy": 150,
  "stuffed": 250,
  "glutenfree": 350,
  "chicken": 150,
  "beef": 150,
  "chevon": 150,
  "peppers": 150,
  "onions": 100,
  "olives": 200,
  "pineapples": 150,
}
priceToppingsSmall = {
  "small": 400,
  "crispy": 100,
  "stuffed": 200,
  "glutenfree": 300,
  "chicken": 100,
  "beef": 100,
  "chevon": 100,
  "peppers": 100,
  "onions": 50,
  "olives": 150,
  "pineapples": 100,
}

// form and dom manipulation
$("document").ready(function(){

  const confirmCheckoutModal = new bootstrap.Modal($('#exampleModal'));

  $('#pizza-form').on('submit', function(evt){
    evt.preventDefault();

    let form = this;
    let size = $(this).find('#size').val();
    let crust = $(this).find('#crust').val();
    let meat = $("input[type=radio][name=inlineRadioOptions]:checked").val();
    var selectedToppings = new Array();
    $('input[name="toppings"]:checked').each(function() {
      selectedToppings.push(this.value);
    });

    //combine values to one array
    listToppings = selectedToppings.concat([size, crust, meat]);

    // Calculate price based on size
    if(size === "large"){
      listOfPrices = listToppings.map(item =>{
        return priceToppingsLarge[item];
      });
  
      totalPrice = listOfPrices.reduce((total,current) =>{
        return total +=current
      });
    }
    else if(size === "medium"){
      listOfPrices = listToppings.map(item =>{
        return priceToppingsMedium[item];
      });
  
      totalPrice = listOfPrices.reduce((total,current) =>{
        return total +=current
      });
    }
    else{
      listOfPrices = listToppings.map(item =>{
        return priceToppingsSmall[item];
      });
  
      totalPrice = listOfPrices.reduce((total,current) =>{
        return total +=current
      });
    }
    //create new pizza object
    pizza = new Pizza(size,crust,meat,selectedToppings);

    pizza["price"] = totalPrice;

    pizzaOrders.push(pizza);

    updateTheTable();
    form.reset();
  });

  //pop up that shows grand total price
  $("#checkout-btn").on("click", function(){
    if(pizzaOrders.length == 0){
      $(".modal-body").text("Please make an order");
      $("#btn-checkout").addClass("d-none"); 
    }
    else{
      calculateGrandTotal();
      $(".modal-body").text("The amount payable for the orders is "+ grandTotal +" .");
      $("#btn-checkout").removeClass("d-none"); 
      $(".table-results tbody").empty();
    }
  });
  //prompt user if they would love delivery
  $("#btn-checkout").on("click",function(){
    confirmCheckoutModal.hide();  
    let text = "Would you like to have your order delivered??";
    if (confirm(text) == true) {

      let location = prompt("Please enter your Location");;
      if (location != null) {
        const transport = 300;
        calculateGrandTotal();
        printOrders();
        let totalHolder = grandTotal+transport;
        $("#no-order-results").text(
          `Your order will be ready in 1 hour. It will be delivered at ${location}
        . The total charge for delivery is ${transport}.
        These are your pizza orders: ${holder}.
        Your total price is: ${totalHolder}`);
        pizzaOrders = [];
      }
    } 
    else {
      printOrders();
      calculateGrandTotal();
      $("#no-order-results").text(`Your order will be ready in 1 hour. Don't forget to come pick!!
      These are your pizza orders: ${holder}. Your total price is: ${grandTotal}`);
      pizzaOrders = [];
  }
  })

  //empty array when modal close button is clicked
  $("#btn-close").on("click",function(){
    pizzaOrders = [];
  });

//function that creates table body with updated orders
  function updateTheTable(){
    $(".table-results tbody").append(`
      <tr>
        <td>${pizza.size} </td>
        <td>${pizza.crust}</td>
        <td>${pizza.meat}</td>
        <td>${pizza.toppings}</td>
        <td>${pizza.price}</td>
      </tr>
    `)
    $("#btn-order").html("ADD ORDER");
  }

  //calculate grand total price
  function calculateGrandTotal(){
    totals = pizzaOrders.map(item =>{
      return item.price;
    });
    grandTotal = totals.reduce((total,current) =>{
      return total +=current
    });
  }
  //function to print order
  function printOrders(){
    items = pizzaOrders.map(item=>{
      return Object.values(item);
    });
    holder = items.join(' : ')
  }

})