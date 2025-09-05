function navigateTo(section) {
  switch (section) {
    case "books":
      window.location.href = "admin-books.html";
      break;
    case "users":
      window.location.href = "/admin-users.html";
      break;
    case "promotions":
      window.location.href = "/src/components/admin/admin-promotions.html";
      break;
    default:
      console.warn("Unknown admin section");
  }
}