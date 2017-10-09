// let timeLabel;

timer = {
    create: function() {
        let me = this;
        me.totalTime = 120;
        me.timeElapsed = 0;
    },
    update: function(){
        socket = io(); // This triggers the 'connection' event on the server
        
        socket.on('start-time', function(startTime) {
           let me = this;
           let currentTime = new Date();
           let timeDifference = startTime - currentTime.getTime();
            // console.log(timeDifference)
           //Time elapsed in seconds
           me.timeElapsed = Math.abs(timeDifference / 1000);
        
           //Time remaining in seconds
           let timeRemaining = me.timeElapsed;
            // console.log(timeRemaining)
           //Convert seconds into minutes and seconds
           let minutes = Math.floor(timeRemaining / 60);
           let seconds = Math.floor(timeRemaining) - (60 * minutes);
        
           //Display minutes, add a 0 to the start if less than 10
           let result = (minutes < 10) ? "0" + minutes : minutes;
        
           //Display seconds, add a 0 to the start if less than 10
           result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
        
           timeLabel.text = result;
        })
}
}