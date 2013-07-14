// Typing for linq.js, ver 3.0.3-Beta4

declare module linqjs {
    interface IEnumerator<T> {
        current(): T;
        moveNext(): boolean;
        dispose(): void;
    }

    interface EnumerableStatic {
        Utils: {
            createLambda(expression: any): (...params: any[]) => any;
            createEnumerable<T>(getEnumerator: () => IEnumerator<T>): Enumerable<T>;
            createEnumerator(initialize: () => void , tryGetNext: () => boolean, dispose: () => void ): IEnumerator<any>;
            extendTo(type: any): void;
        };
        choice<T>(...params: T[]): Enumerable<T>;
        cycle<T>(...params: T[]): Enumerable<T>;
        empty(): Enumerable<any>;
        from<T>(obj: Enumerable<T>): Enumerable<T>;
        from(obj: string): Enumerable<string>;
        from(obj: number): Enumerable<number>;
        from<T>(obj: { length: number;[x: number]: T; }): Enumerable<T>;
        from<T>(obj: T[]): Enumerable<T>;
        from(obj: any): Enumerable<any>;
        make<T>(element: T): Enumerable<T>;
        matches(input: string, pattern: RegExp): Enumerable;
        matches(input: string, pattern: string, flags?: string): Enumerable;
        range(start: number, count: number, step?: number): Enumerable<number>;
        rangeDown(start: number, count: number, step?: number): Enumerable<number>;
        rangeTo(start: number, to: number, step?: number): Enumerable<number>;
        repeat<T>(element: T, count?: number): Enumerable<T>;
        repeatWithFinalize(initializer: () => any, finalizer: (element) => void ): Enumerable;
        generate<T>(func: () => T, count?: number): Enumerable<T>;
        toInfinity(start?: number, step?: number): Enumerable<number>;
        toNegativeInfinity(start?: number, step?: number): Enumerable<number>;
        unfold<T>(seed: T, func: (value: T) => T): Enumerable<T>;
        defer(enumerableFactory: () => Enumerable): Enumerable;
    }

    interface Enumerable<T> {
        constructor(getEnumerator: () => IEnumerator<T>);
        getEnumerator(): IEnumerator<T>;

        // Extension Methods
        traverseBreadthFirst(func: (element: any) => Enumerable, resultSelector?: (element: any, nestLevel: number) => any): Enumerable;
        traverseDepthFirst(func: (element: any) => Enumerable, resultSelector?: (element: any, nestLevel: number) => any): Enumerable;
        flatten(): Enumerable<any>;
        pairwise<TResult>(selector: (prev: T, current: T) => TResult): Enumerable<TResult>;
        scan<TResult>(func: (prev: T, current: T) => TResult): Enumerable<TResult>;
        scan<TResult>(seed: T, func: (prev: T, current: T) => TResult): Enumerable<TResult>;
        select<TResult>(selector: (element: T, index: number) => TResult): Enumerable<TResult>;
        selectMany<TResult>(collectionSelector: (element: T, index: number) => TResult[], resultSelector?: (outer: any, inner: any) => any): Enumerable<TResult>;
        selectMany<TResult>(collectionSelector: (element: T, index: number) => Enumerable<TResult>, resultSelector?: (outer: any, inner: any) => any): Enumerable<TResult>;
        selectMany<TResult>(collectionSelector: (element: T, index: number) => { length: number;[x: number]: TResult; }, resultSelector?: (outer: any, inner: any) => any): Enumerable<TResult>;
        where(predicate: (element: T, index: number) => boolean): Enumerable<T>;
        choose(selector: (element: any, index: number) => any): Enumerable;
        ofType(type: any): Enumerable<any>;
        zip<TSecond, TResult>(second: TSecond[], resultSelector: (first: T, second: TSecond, index: number) => TResult): Enumerable<TResult>;
        zip<TSecond, TResult>(second: Enumerable<TSecond>, resultSelector: (first: T, second: TSecond, index: number) => TResult): Enumerable<TResult>;
        zip<TSecond, TResult>(second: { length: number;[x: number]: TSecond; }, resultSelector: (first: T, second: TSecond, index: number) => TResult): Enumerable<TResult>;
        zip(...params: any[]): Enumerable<any>; // last one is selector
        merge(second: any[], resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        merge(second: Enumerable<any>, resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        merge(second: { length: number;[x: number]: any; }, resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        merge(...params: any[]): Enumerable; // last one is selector
        join(inner: Enumerable<any>, outerKeySelector: (outer: any) => any, innerKeySelector: (inner: any) => any, resultSelector: (outer: any, inner: any) => any, compareSelector?: (obj: any) => any): Enumerable;
        groupJoin(inner: Enumerable<any>, outerKeySelector: (outer: any) => any, innerKeySelector: (inner: any) => any, resultSelector: (outer: any, inner: any) => any, compareSelector?: (obj: any) => any): Enumerable;
        all(predicate: (element: T) => boolean): boolean;
        any(predicate?: (element: T) => boolean): boolean;
        isEmpty(): boolean;
        concat(...sequences: T[]): Enumerable<T>;
        insert(index: number, second: any[]): Enumerable<any>;
        insert(index: number, second: Enumerable<any>): Enumerable<any>;
        insert(index: number, second: { length: number;[x: number]: any; }): Enumerable<any>;
        alternate(alternateValue: any): Enumerable;
        alternate(alternateSequence: any[]): Enumerable;
        alternate(alternateSequence: Enumerable<any>): Enumerable;
        contains(value: any, compareSelector: (element: any) => any): Enumerable;
        defaultIfEmpty(defaultValue?: T): Enumerable<T>;
        distinct(compareSelector?: (element: T) => any): Enumerable<T>;
        distinctUntilChanged(compareSelector: (element: T) => any): Enumerable;
        except(second: T[], compareSelector?: (element: T) => any): Enumerable<T>;
        except(second: { length: number;[x: number]: T; }, compareSelector?: (element: T) => any): Enumerable<T>;
        except(second: Enumerable<T>, compareSelector?: (element: T) => any): Enumerable<T>;
        intersect(second: T[], compareSelector?: (element: T) => any): Enumerable<T>;
        intersect(second: { length: number;[x: number]: T; }, compareSelector?: (element: T) => any): Enumerable<T>;
        intersect(second: Enumerable<T>, compareSelector?: (element: T) => any): Enumerable<T>;
        sequenceEqual(second: T[], compareSelector?: (element: T) => any): Enumerable<T>;
        sequenceEqual(second: { length: number;[x: number]: T; }, compareSelector?: (element: T) => any): Enumerable<T>;
        sequenceEqual(second: Enumerable<T>, compareSelector?: (element: T) => any): Enumerable<T>;
        union(second: T[], compareSelector?: (element: T) => any): Enumerable<T>;
        union(second: { length: number;[x: number]: T; }, compareSelector?: (element: T) => any): Enumerable<T>;
        union(second: Enumerable<T>, compareSelector?: (element: T) => any): Enumerable<T>;
        orderBy(keySelector: (element: T) => any): OrderedEnumerable<T>;
        orderByDescending(keySelector: (element: T) => any): OrderedEnumerable<T>;
        reverse(): Enumerable<T>;
        shuffle(): Enumerable<T>;
        weightedSample(weightSelector: (element: T) => any): Enumerable;
        groupBy(keySelector: (element: T) => any, elementSelector?: (element: T) => any, resultSelector?: (key: any, element: T) => any, compareSelector?: (element: T) => any): Enumerable;
        partitionBy(keySelector: (element: T) => any, elementSelector?: (element: T) => any, resultSelector?: (key: any, element: T) => any, compareSelector?: (element: T) => any): Enumerable;
        buffer(count: number): Enumerable<any[]>;
        aggregate(func: (prev: T, current: T) => T): T;
        aggregate<TResult>(seed: T, func: (prev: T, current: T) => T, resultSelector?: (last: T) => TResult): TResult;
        average(selector?: (element: T) => any): number;
        count(predicate?: (element: T, index: number) => boolean): number;
        max(selector?: (element: T) => any): number;
        min(selector?: (element: T) => any): number;
        maxBy(keySelector: (element: T) => any): T;
        minBy(keySelector: (element: T) => any): T;
        sum(selector?: (element: T) => any): number;
        elementAt(index: number): T;
        elementAtOrDefault(index: number, defaultValue?: T): T;
        first(predicate?: (element: T, index: number) => boolean): T;
        firstOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
        last(predicate?: (element: T, index: number) => boolean): T;
        lastOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
        single(predicate?: (element: T, index: number) => boolean): T;
        singleOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
        skip(count: number): Enumerable<T>;
        skipWhile(predicate: (element: T, index: number) => boolean): Enumerable<T>;
        take(count: number): Enumerable<T>;
        takeWhile(predicate: (element: T, index: number) => boolean): Enumerable<T>;
        takeExceptLast(count?: number): Enumerable<T>;
        takeFromLast(count: number): Enumerable<T>;
        indexOf(item: T): number;
        indexOf(predicate: (element: T, index: number) => boolean): number;
        lastIndexOf(item: T): number;
        lastIndexOf(predicate: (element: T, index: number) => boolean): number;
        asEnumerable(): Enumerable<T>;
        toArray(): T[];
        toLookup<TKey>(keySelector: (element: T) => TKey, elementSelector?: (element: T) => any, compareSelector?: (element: T) => any): Lookup<TKey, any>;
        toObject(keySelector: (element: T) => any, elementSelector?: (element: T) => any): Object;
        toDictionary<TKey, TValue>(keySelector: (element: T) => TKey, elementSelector?: (element: T) => TValue, compareSelector?: (element: T) => any): Dictionary<TKey, TValue>;
        toJSONString(replacer: (key: string, value: any) => any): string;
        toJSONString(replacer: any[]): string;
        toJSONString(replacer: (key: string, value: any) => any, space: any): string;
        toJSONString(replacer: any[], space: any): string;
        toJoinedString(separator?: string, selector?: (element: T, index: number) => any): string;
        doAction(action: (element: T, index: number) => void ): Enumerable;
        doAction(action: (element: T, index: number) => boolean): Enumerable;
        forEach(action: (element: T, index: number) => void ): void;
        forEach(action: (element: T, index: number) => boolean): void;
        write(separator?: string, selector?: (element: T) => any): void;
        writeLine(selector?: (element: T) => any): void;
        force(): void;
        letBind(func: (source: Enumerable<any>) => any[]): Enumerable;
        letBind(func: (source: Enumerable<any>) => { length: number;[x: number]: any; }): Enumerable;
        letBind(func: (source: Enumerable<any>) => Enumerable): Enumerable;
        share(): DisposableEnumerable;
        memoize(): DisposableEnumerable;
        catchError(handler: (exception: any) => void ): Enumerable;
        finallyAction(finallyAction: () => void ): Enumerable;
        log(selector?: (element: T) => void ): Enumerable;
        trace(message?: string, selector?: (element: T) => void ): Enumerable;
    }

    interface OrderedEnumerable<T> extends Enumerable<T> {
        createOrderedEnumerable(keySelector: (element: T) => any, descending: boolean): OrderedEnumerable<T>;
        thenBy(keySelector: (element: T) => any): OrderedEnumerable<T>;
        thenByDescending(keySelector: (element: T) => any): OrderedEnumerable<T>;
    }

    interface DisposableEnumerable extends Enumerable {
        dispose(): void;
    }

    interface Dictionary<TKey, TValue> {
        add(key: TKey, value: TValue): void;
        get(key: TKey): TValue;
        set(key: TKey, value: TValue): boolean;
        contains(key: TKey): boolean;
        clear(): void;
        remove(key: TKey): void;
        count(): number;
        toEnumerable(): Enumerable; // Enumerable<KeyValuePair>
    }

    interface Lookup<TKey, TValue> {
        count(): number;
        get(key: TKey): Enumerable<TValue>;
        contains(key: TKey): boolean;
        toEnumerable(): Enumerable; // Enumerable<Groping>
    }

    interface Grouping extends Enumerable {
        key(): any;
    }
}

// export definition
declare var Enumerable: linqjs.EnumerableStatic;