import Vue from 'vue';
import store from './utils/store';
import router from './utils/router';
import axios from './utils/axios';
import {Container, MessageBox, Loading, Notification, Message, Row, Header, Card, Image, Menu, Col, Dropdown, Input, Button, Submenu, Select,
    DropdownMenu, DropdownItem, Option, Main, MenuItem, Switch, Aside, Footer, Tooltip, Link, Form, FormItem, Checkbox, CheckboxButton,
    CheckboxGroup, Table, TableColumn, MenuItemGroup, Icon, Tag} from 'element-ui';
import App from './App.vue';
import commonUtil from "./utils/common";
import globalConfig from "./globalConfig";
import Clipboard from 'clipboard'
import "./css/common.css";

Vue.config.productionTip = false;
Vue.prototype["$commonUtil"] = commonUtil;
Vue.prototype["$globalConfig"] = globalConfig;
Vue.prototype.clipboard = Clipboard;

// 按需引用element
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Container);
Vue.use(Header);
Vue.use(Row);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Aside);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Image);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Col);
Vue.use(Icon);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Link);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

new Vue({
    router,
    store,
    axios,
    render: h => h(App)
}).$mount('#app');