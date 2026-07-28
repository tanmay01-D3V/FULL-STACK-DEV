class A{
    add(a, b){
        console.log("2 Parameter");
    }

    add(a, b, c){
        console.log("3 Parameter");
    }   

    add(a, b, c, d){
        console.log("4 Parameter");
    }
}

a=new A();
a.add(10, 20);
a.add(10, 20, 30);
a.add(10, 20, 30, 40);
