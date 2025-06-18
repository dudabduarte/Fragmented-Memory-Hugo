const Inventario = {
  get() {
    return JSON.parse(localStorage.getItem('inventario')) || [];
  },

  add(item) {
    const inventario = this.get();
    if (!inventario.includes(item)) {
      inventario.push(item);
      localStorage.setItem('inventario', JSON.stringify(inventario));
      console.log(`Item "${item}" adicionado ao inventário.`);
    } else {
      console.log(`Item "${item}" já está no inventário.`);
    }
  },

  has(item) {
    return this.get().includes(item);
  },

  list() {
    return this.get();
  },

  remove(item) {
    const inventario = this.get();
    const novoInventario = inventario.filter(i => i !== item);
    localStorage.setItem('inventario', JSON.stringify(novoInventario));
    console.log(`Item "${item}" removido do inventário.`);
  }
};
