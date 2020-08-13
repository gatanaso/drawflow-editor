package com.packagename.myapp;

import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.router.Route;

@Route("")
public class View extends Div {

    public View() {
        DrawFlowEditor drawFlowEditor = new DrawFlowEditor();
        add(drawFlowEditor);
        setSizeFull();
    }
}
