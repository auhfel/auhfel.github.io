var UI = {
    AddLabel: function(element,labelText) {
        let textDiv = document.createElement("div");
        textDiv.textContent = labelText;
        textDiv.style.display = "flex";
        textDiv.style.color = "#FFFFFF";
        textDiv.style.backgroundColor = "#000000";
        textDiv.style.justifyContent = "center";
        element.appendChild(textDiv);
    },
    SetPosition: function(element, X, Y) {
        element.style.left = X+"px";
        element.style.top = Y+"px";
    },
    SetDimensions: function(element, Width, Height) {
        element.style.width = Width;
        element.style.height = Height;
    },
    Panel: function(X,Y,Width,Height,parentElement = null, label = "Panel") {
        let div = document.createElement("div");
        div.style.position = "absolute";
        this.SetPosition(div,X,Y);
        this.SetDimensions(div,Width,Height);
        div.style.backgroundColor = "#FF9944FF";
        if(parentElement == null)
            document.body.appendChild(div);
        else 
            parentElement.appendChild(div);
        if(label != null)
            this.AddLabel(div,label);
        return div;
    },
    Button: function(label,X,Y,Width,Height) {

    },
    
};