

/////////////////////////////////////////////////////////////////////////////

// Step 1: Set up the User Interface for the first pop-up
var dialog1 = new Window("dialog", "Shape Creator", undefined, { resizeable: false });
dialog1.size = [400, 150];
// dialog1.orientation = "column";

var dimensionGroup = dialog1.add("group");
dimensionGroup.add("statictext", undefined, "Width (inches):");
var widthInput = dimensionGroup.add("edittext", [0, 0, 50, 20], ""); // Adjust the preferredSize here

dimensionGroup.add("statictext", undefined, "Height (inches):");
var heightInput = dimensionGroup.add("edittext", [0, 0, 50, 20], ""); // Adjust the preferredSize here

var shapeButtonGroup = dialog1.add("group");
var circleButton = shapeButtonGroup.add("radiobutton", undefined, "Circle");
var squareButton = shapeButtonGroup.add("radiobutton", undefined, "Square");


var nextButton = dialog1.add("button", undefined, "Next");
nextButton.enabled = false; // Disable Next button initially

/////////////////////////////////////////////////////////////////////////////

// Step 2: Update Next button state based on input
widthInput.onChange = heightInput.onChange = function() {
  var widthValue = parseFloat(widthInput.text);
  var heightValue = parseFloat(heightInput.text);

  if (isNaN(widthValue) || isNaN(heightValue) || widthValue <= 0 || heightValue <= 0) {
    nextButton.enabled = false; // Disable Next button if input is invalid
  } else {
    nextButton.enabled = true; // Enable Next button if input is valid
  }
};

/////////////////////////////////////////////////////////////////////////////

// Step 3: Retrieve User Input from the first pop-up
nextButton.onClick = function() {
    var width = parseFloat(widthInput.text) * 72; // Convert inches to points
    var height = parseFloat(heightInput.text) * 72; // Convert inches to points
    var isCircle = circleButton.value;
  
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      // Step 4: Create the Shape based on User Input
      var shape;
      if (isCircle) {
        shape = app.activeDocument.activeLayer.pathItems.ellipse(0, 0, width, height);
      } else {
        shape = app.activeDocument.activeLayer.pathItems.rectangle(0, 0, width, height);
      }
  
      shape.filled = false;
      shape.stroked = true;
      shape.strokeWidth = 65;
      shape.strokeColor = new CMYKColor(0, 0, 0, 50);
  
      // Reduce the size of the shape by 75%
      var scaleRatio = 0.25; // 1/4th scale
      shape.resize(scaleRatio * 100, scaleRatio * 100, true, true, true, true, scaleRatio * 100);
  
      dialog1.close();
      showDialog2(shape);
    }
  };
  
/////////////////////////////////////////////////////////////////////////////

// Step 5: Set up the User Interface for the second pop-up
function showDialog2(shape) {
  var dialog2 = new Window("dialog", "Text Input", undefined, { resizeable: false });
  dialog2.size = [300, 125];
  dialog2.orientation = "column";

  var textGroup = dialog2.add("group");
  textGroup.add("statictext", undefined, "Enter Text:");
  var textInput = textGroup.add("edittext", undefined, "", {
    multiline: true,
    scrolling: true,
    enterKeySignalsOnChange: false
  });
  textInput.minimumSize.width = 200;
  textInput.minimumSize.height = 50;

  var generateButton = dialog2.add("button", undefined, "Generate");

/////////////////////////////////////////////////////////////////////////////

  // Step 6: Retrieve User Input from the second pop-up
  generateButton.onClick = function() {
    var textContent = textInput.text;

/////////////////////////////////////////////////////////////////////////////

// Step 7: Generate Text on the Artboard within the Shape
var textFrame = app.activeDocument.activeLayer.textFrames.add();
textFrame.contents = textContent;
textFrame.textRange.characterAttributes.fillColor = new CMYKColor(0, 0, 0, 75);

// Get the bounds of the shape and text frame
var shapeBounds = shape.geometricBounds;
var textBounds = textFrame.geometricBounds;

// Calculate the scale factor for text enlargement
var scaleFactor = Math.min((shapeBounds[2] - shapeBounds[0]) / textBounds[2], (shapeBounds[3] - shapeBounds[1]) / textBounds[3]);

// Enlarge the text frame to fill the shape
textFrame.resize(scaleFactor * 80, scaleFactor * 80, true, true, true, true, scaleFactor * 80);

// Calculate the new bounds of the enlarged text frame
textBounds = textFrame.geometricBounds;

// Calculate the offset for horizontal and vertical alignment
var xOffset = (shapeBounds[2] - shapeBounds[0] - textBounds[2] + textBounds[0]) / 2;
var yOffset = (shapeBounds[3] - shapeBounds[1] - textBounds[3] + textBounds[1]) / 2;

// Move the text frame to align it with the shape

textFrame.top = (shape.top + yOffset);
textFrame.left =(shape.left + xOffset);

var widthValue = parseFloat(widthInput.text);
var heightValue = parseFloat(heightInput.text);

if(heightValue <= 5) {
  textFrame.top = (shape.top + yOffset) + 75;
  textFrame.left =(shape.left + xOffset);
  var initialSize = 50; 
  textFrame.textRange.characterAttributes.size = initialSize;
  var newSize = initialSize * 2; 
  textFrame.textRange.characterAttributes.size = newSize; 
}

if (widthValue <= 5) {
  textFrame.top = (shape.top + yOffset) - 100;
  textFrame.left =(shape.left + xOffset) - 50;
  textFrame.rotate(90);
  var initialSize = 50; 
  textFrame.textRange.characterAttributes.size = initialSize;

  // Increase the text size
  var newSize = initialSize * 2; // Replace 1.5 with the factor by which you want to increase the size
  textFrame.textRange.characterAttributes.size = newSize; 
}

/////////////////////////////////////////////////////////////////////////////

// Step 8: Group the Text with the Shape and center on the artboard
var groupItems = app.activeDocument.activeLayer.groupItems;
var group = groupItems.add();
group.name = "Shape with Text";
shape.move(group, ElementPlacement.PLACEATEND);
textFrame.move(group, ElementPlacement.PLACEATEND);

// Get the bounds of the artboard and the group
var artboard = app.activeDocument.artboards[0];
var artboardBounds = artboard.artboardRect;
var groupBounds = group.geometricBounds;

// Calculate the center of the artboard and the center of the group
var artboardCenterX = (artboardBounds[0] + artboardBounds[2]) / 2;
var artboardCenterY = (artboardBounds[1] + artboardBounds[3]) / 2;
var groupCenterX = (groupBounds[0] + groupBounds[2]) / 2;
var groupCenterY = (groupBounds[1] + groupBounds[3]) / 2;

// Calculate the translation needed to center the group on the artboard
var xOffset = artboardCenterX - groupCenterX;
var yOffset = artboardCenterY - groupCenterY;

// Move the group to the center of the artboard
group.translate(xOffset, yOffset);

dialog2.close();


  };

  dialog2.show();
}


dialog1.show();




///////////////////////////////////////////////////////////
