function getCity(lat, lng) {
  console.log(1);
  var xhr = new XMLHttpRequest();
  // Paste your LocationIQ token below.
  xhr.open(
    "GET",
    "https://eu1.locationiq.com/v1/reverse.php?key=f7f3cd67e34514&lat=" +
      lat +
      "&lon=" +
      lng +
      "&format=json",
    true
  );
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var a = response.address.city;
      return a;
    }
  };
}

function dist(lat1, lat2, lon1, lon2) {
  const R = 6371.071; // kmetres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in kmetres
  return d.toFixed(2);
}

function card(a, b, c, d) {
  var head = document.createElement("h5");
  head.className = "card-title card-header";
  head.appendChild(document.createTextNode(a));

  var ul = document.createElement("ul");
  ul.className = "list-group list-group-flush";

  var li1 = document.createElement("li");
  li1.className = "list-group-item";
  li1.appendChild(document.createTextNode("Location: " + b));

  var li2 = document.createElement("li");
  li2.className = "list-group-item";
  li2.appendChild(document.createTextNode("Total Beds: " + c));

  var li3 = document.createElement("li");
  li3.className = "list-group-item";
  li3.appendChild(document.createTextNode("Available Beds: " + d));

  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);

  var disp = document.getElementById("new");

  var div1 = document.createElement("div");
  var div2 = document.createElement("div");
  var div3 = document.createElement("div");

  div1.className = "col-sm-6";
  div2.className = "card";
  div3.className = "card-body";

  div3.appendChild(head);
  div3.appendChild(ul);
  div2.appendChild(div3);
  div1.appendChild(div2);

  disp.appendChild(div1);
}
