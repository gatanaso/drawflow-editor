package com.packagename.myapp;

import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;

@Tag("drawflow-editor")
@JsModule("./drawflow-editor.js")
public class DrawFlowEditor extends Component implements HasSize {

    public DrawFlowEditor() {
        setSizeFull();
    }
}
