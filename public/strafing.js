        //Strafing
        //if they're facing up or down and pressing shift
        // if (me.rotation = (6.3 || 3.1) && ((shift && left) || (shift && right))) {
        //     console.log('strafin mister')
        //     me.body.x += 10;
        // }
        // if (shift && left || shift && right) {
        //     if (me.rotation === )
        // }

function strafeConditions(input, x, y) {
    if (shift && input) {
        me.body.velocity.x = x;
        me.body.velocity.y = y;
    } 
}

if (me.rotation = 4.7) { //facing right
    strafeConditions(up, 0, -250);
    strafeConditions(down, 0, 250)
    // if (shift && up) {
    //     me.body.velocity.y = -250
    //     me.body.velocity.x = 0
    //     me.rotation = 4.7
    // } if (shift && down) {
    //     me.body.velocity.y = -250;
    //     me.body.velocity.x = 0;
        me.rotation = 4.7
    // }
}

if (shift && up && (me.rotation = (4.7 || 1.6))) { //strafe up or down
        // if (me.rotation = 4.7) {
        //     
        // }
        // me.rotation = 1.6
      
}
else if (shift && down && (me.rotation = (4.7 || 1.6))) { //strafe up or down
    // if (me.rotation = 4.7) {
        // me.rotation = 4.7
    // }
    // me.rotation = 1.6
    me.body.velocity.y = 250
    me.body.velocity.x = 0
}
else if (shift && left) { //strafe left or right
    if (me.rotation = 3.1) {
        me.rotation = 3.1
    }
    me.rotation = 6.3
    me.body.velocity.y = 0;
    me.body.velocity.x = -250;   
}
else if (shift && right) { //strafe left or right
    if (me.rotation = 3.1) {
        me.rotation = 3.1
    }
    me.rotation = 6.3
    me.body.velocity.y = 0;
    me.body.velocity.x = 250;
}