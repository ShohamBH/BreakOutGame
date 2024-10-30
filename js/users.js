//שמירת הנתונים תתבצע באופן של מערך של אובייקטים

// מחזיר את הנתונים שכבר יש לי בלוקל סטורז' במאגר יוזרס
let users = localStorage.getItem('users');
console.log(users);

// פונקציה שמתבצעת בעת התחברות
function clab(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    let users = localStorage.getItem('users');
    users = users ? JSON.parse(users) : []; // אם אין נתונים, נשתמש במערך ריק

    // console.log('Users array:', users);

    const user = users.find(user => user.username === username && user.password === password);
    // console.log('Found user:', user);
    
    if (user) {
        localStorage.setItem('loggedInUser', username)
        localStorage.setItem('ploggedInUser', password)
        window.location.href = 'more.html'
    } 
    else {
        const res = confirm('המשתמש לא נמצא או שהסיסמה שגויה. נא להרשם מחדש. לרישום מחדש הקש "אישור" אחרת, לניסיון נוסף הקש "ביטול".')
        if (res)
            window.location.href = 'new_clab.html'
        else
            window.location.href = 'clab.html'
    }
}

// פונקציה שמתבצעת בעת הרשמה
function new_clab(event) {
    event.preventDefault();

    const firstname = document.getElementById('firstname').value
    const lastname = document.getElementById('lastname').value
    const password = document.getElementById('password').value
    const username = firstname + ' ' + lastname

    let user = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
        maxScore: 0 // אתחול הניקוד המרבי ל-0 בהתחלה
    };

    let users = localStorage.getItem('users');
    users = users ? JSON.parse(users) : []; // אם אין נתונים, נשתמש במערך ריק

    console.log('Users array before registration:', users);

    // בדוק אם יש כבר משתמש עם אותו שם משתמש וסיסמה
    const userExists = users.some(find_ => find_.username === username && find_.password === password);
    console.log('User exists:', userExists);

    if (!userExists) {
        users.push(user);
        //לוקחת את היוזר הופך למחרוזת ושומר בלוקל סטורז' עם השם יוזר
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', username);
        localStorage.setItem('ploggedInUser', password) 
        alert('הרשמה בוצעה בהצלחה. אתה יכול להתחבר עכשיו.');
        window.location.href = 'clab.html';
    } else 
        alert('המשתמש כבר קיים עם אותה סיסמה. נסה שם משתמש אחר או סיסמה אחרת.');
    
}

// console.log(users);

// פונקציה שתיקרא כאשר העמוד ייטען
document.querySelector("form").onsubmit = (event) => {
    event.preventDefault(); // עוצר את שליחת הטופס הבסיסית

    //בדיקה באיזה עמוד אנחנו
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'clab.html') {
        clab(event); // פנה לפונקציה שלך
    } else if (currentPage === 'new_clab.html') {
        new_clab(event); // פנה לפונקציה שלך
    }
};

// localStorage.clear()

