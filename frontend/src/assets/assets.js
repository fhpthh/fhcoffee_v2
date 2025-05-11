import logo from './logo.png';
import coffeehero from './coffee-hero-section.png';
import space1 from './space1.jpg';
import space2 from './space2.jpg';
import space3 from './space3.jpg';
import latte from './latte.jpg';
import cappuccino from './capuchino.jpg';
import espresso from './espresso.jpg';
import americano from './americano.jpg';
import frappuchino from './frappuchino.jpg';
import icedcoffee from './icedcoffe.jpg';
import icedLatte from './icedLatte.jpg';
import hotbeverages from './hot-beverages.png';
import matchalatte from './matchalatte.jpg';
import coldbeverage from './coldbeverages.png';
import searchicon from './download.png';
import carticon from './carticon.png';
import cafe from './cafe.jpg';
import matcha from './matcha.jpg';
import teamilk from './teamilk.jpg';
import greentea from './greentea.jpg';
import cake from './cake.jpg';
import addIcon from './add.png';
import user1 from './friend.jpg';
import user2 from './friend2.jpg';
import user3 from './friend.jpg';
import ggplay from './ggplay.png';
import appstore from './appstore.png';
import cross_icon from './crossicon.jpg';
import avatar from './avatar.png';
import bag from './bag.png';
import logout from './logout.png';
import order from './order.png';

export const assets = {
    logo,
    coffeehero,
    space1,
    space2,
    space3,
    latte,
    cappuccino,
    espresso,
    americano,
    frappuchino,
    icedcoffee,
    icedLatte,
    hotbeverages,
    matchalatte,
    coldbeverage,
    searchicon,
    carticon,
    addIcon,
    ggplay,
    appstore,
    cross_icon,
    avatar,
    bag,
    logout,
    order
};

export const menu_list = [
    {
        menu_name: "Cafe",
        menu_image: cafe,
    },
    {
        menu_name: "Matcha",
        menu_image: matcha,
    },
    {
        menu_name: "Milktea",
        menu_image: teamilk,
    },
    {
        menu_name: "Tea",
        menu_image: greentea,
    },
    {
        menu_name: "Cake",
        menu_image: cake,
    }
]
export const food_list = [
    {
        _id: "1",
        name: "Espresso",
        image: espresso,
        price: 45000,
        description: "Espresso là một loại cà phê đậm đặc, được chiết xuất từ hạt cà phê rang xay bằng áp suất cao. Nó có hương vị mạnh mẽ và thường được sử dụng làm cơ sở cho nhiều loại đồ uống cà phê khác.",
        category: "Cafe",
    },
    {
        _id: "2",
        name: "Cappuccino",
        image: cappuccino,
        price: 50000,
        description: "Cappuccino là một loại đồ uống cà phê được làm từ espresso, sữa nóng và bọt sữa. Nó thường được trang trí bằng bột cacao hoặc bột quế.",
        category: "Cafe",
    },
    {
        _id: "3",
        name: "Americano",
        image: americano,
        price: 50000,
        description: "Americano là một loại cà phê được pha bằng cách thêm nước nóng vào espresso, tạo ra một hương vị nhẹ nhàng hơn.",
        category: "Cafe",
    },
    {
        _id: "4",
        name: "Iced Latte",
        image: icedLatte,
        price: 60000,
        description: "Iced Latte là một loại đồ uống cà phê lạnh được làm từ espresso và sữa lạnh, thường được phục vụ với đá.",
        category: "Cafe",
    },
    {
        _id: "5",
        name: "Iced Coffee",
        image: icedcoffee,
        price: 60000,
        description: "Iced Coffee là một loại cà phê được pha lạnh, thường được phục vụ với đá và có thể thêm đường hoặc sữa theo sở thích.",
        category: "Cafe",
    },
    {
        _id: "6",
        name: "Frappuccino",
        image: frappuchino,
        price: 70000,
        description: "Frappuccino là một loại đồ uống cà phê lạnh, thường được làm từ espresso, sữa, đá và có thể thêm hương vị như caramel hoặc mocha.",
        category: "Cafe",
    },
    {
        _id: "7",
        name: "Latte",
        image: latte,
        price: 60000,
        description: "Latte là một loại đồ uống cà phê được làm từ espresso và sữa nóng, thường được trang trí bằng bọt sữa.",
        category: "Cafe",
    },
    {
        _id: "8",
        name: "Matcha Latte",
        image: matchalatte,
        price: 70000,
        description: "Matcha Latte là một loại đồ uống được làm từ bột trà xanh matcha và sữa nóng, mang đến hương vị thơm ngon và bổ dưỡng.",
        category: "Matcha",
    },
    {
        _id: "9",
        name: "Hot Chocolate",
        image: latte,
        price: 60000,
        description: "Hot Chocolate là một loại đồ uống nóng được làm từ sô cô la và sữa, thường được trang trí bằng kem tươi hoặc bột cacao.",
        category: "Milktea",
    },
    {
        _id: "10",
        name: "Cold Brew",
        image: icedcoffee,
        price: 70000,
        description: "Cold Brew là một loại cà phê được pha lạnh trong thời gian dài, mang đến hương vị nhẹ nhàng và ít axit hơn.",
        category: "Cafe",
    },
    {
        _id: "11",
        name: "Iced Americano",
        image: icedLatte,
        price: 60000,
        description: "Iced Americano là một loại cà phê lạnh được pha bằng cách thêm nước lạnh vào espresso, tạo ra một hương vị nhẹ nhàng hơn.",
        category: "Cafe",
    },
    {
        _id: "12",
        name: "Iced Matcha Latte",
        image: matchalatte,
        price: 70000,
        description: "Iced Matcha Latte là một loại đồ uống lạnh được làm từ bột trà xanh matcha và sữa lạnh, mang đến hương vị thơm ngon và bổ dưỡng.",
        category: "Matcha",
    },
    {
        _id: "13",
        name: "Iced Tea",
        image: icedLatte,
        price: 50000,
        description: "Iced Tea là một loại trà lạnh, thường được phục vụ với đá và có thể thêm đường hoặc chanh theo sở thích.",
        category: "Tea",
    },
    {
        _id: "14",
        name: "Cheese Cake",
        image: cake,
        price: 80000,
        description: "Cheese Cake là một loại bánh ngọt được làm từ phô mai kem, đường và bánh quy nghiền, thường được trang trí bằng trái cây hoặc sốt caramel.",
        category: "Cake",
    },
    {
        _id: "15",
        name: "Chocolate Cake",
        image: cake,
        price: 80000,
        description: "Chocolate Cake là một loại bánh ngọt được làm từ bột cacao, đường và kem, thường được trang trí bằng kem sô cô la.",
        category: "Cake",
    }
]

export const reviews = [
    {
        name: "Phan Ngọc Hân",
        avatar: user1,
        text: "Lần đầu ghé quán mà ấn tượng cực mạnh! Cà phê đậm đà, thơm nức mũi, phục vụ dễ thương hết nước chấm. Đặc biệt là món Cold Brew ở đây đúng chuẩn 'gây nghiện'.",
        role: "Khách quen"
    },
    {
        name: "Nhật Minh",
        avatar: user2,
        text: "Không gian chill, nhạc nhẹ dễ chịu. Ngồi làm việc nguyên buổi mà không bị ai làm phiền. Chỉ mong ổ điện nhiều thêm xíu là hoàn hảo luôn!.",
        role: "Khách quen"
    },
    {
        name: "Phương Anh",
        avatar: user3,
        text: "Quán decor theo kiểu Hàn nhẹ nhàng, sống ảo cháy máy. Mình gọi trà đào cam sả mà phải nói là đỉnh cao! Giá hợp lý, sẽ quay lại thường xuyên.",
        role: "Khách quen"
    },
    {
        name: "Phương Anh",
        avatar: user3,
        text: "Đặt giao tận nhà mà đồ uống vẫn còn mát lạnh, đóng gói cẩn thận. Ghi chú extra đá cũng làm đúng, có tâm thật sự!.",
        role: "Khách quen"
    },

];
export default assets;