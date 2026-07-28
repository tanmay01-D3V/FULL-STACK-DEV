class A{
    dairyMilk(){
        console.log("A class Dairy Milk");
    }
}

class B extends A{
    dairyMilk(){
        console.log("B class Five Star");
    }
}

class C extends B{
    dairyMilk(){
        console.log("C class Kit Kat");
    }
}

a = new A();
b = new B();
c = new C();

a.dairyMilk();
b.dairyMilk();
c.dairyMilk();