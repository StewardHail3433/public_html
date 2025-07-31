export default class Menu {
    constructor () {
        this.elementMap = new Map();
        this.openAnimation = () => {};
        this.closeAnimation = () => {};
        this.isOpen = false;
    }

    open() {
        this.isOpen = true;
        this.openAnimation();
    }

    close() {
        this.isOpen = false;
        this.closeAnimation();
    }


    addUiElement(id, element) {
        this.elementMap.set(id, element);
    }

    getElement(id) {
        return this.elementMap.get(id);
    }

    deleteElement(id) {
        this.elementMap.delete(id);
    }

    update(dt) {
        for (const [key, value] of this.elementMap) {
            value.update(dt);
        }
    }

    render(ctx) {
        for (const [key, value] of this.elementMap) {
            value.render(ctx);
        }
    }
}