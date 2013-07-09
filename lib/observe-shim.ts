interface Object {
    observe(target: Object, observer: (changes) => void );
    unobserve(target: Object, observer: (changes) => void );
    deliverChangeRecords(observer: (changes) => void );
    getNotifier(target: Object);
}