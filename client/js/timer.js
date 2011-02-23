/**
 * Universal Timer.
 * Prevents of creating many timeouts and intervals (performance overhead).
 * Instead, it uses just one interval and custom timeouts and
 * intervals are created programmatically.
 * Global interval resolution can be set via MISC.globalTimerResolution.
 *
 * Timers can be paused by calling Timer.destroy() and rerun by calling
 * Timer.init() again.
 */

var Timer = {
    guid: 1,
    timers: [],
    init: function () {
        this.time = 0;
        
        this.globalIntervalId = setInterval( function () {
            
            var time = this.time += MISC.globalTimerResolution;
            
            this.timers.forEach( function ( t ) {
                if ( t.guard && t.guard.call( t.scope || null, time ) ) {
                    t.callback && t.callback.call( t.scope || null, time );
                }
            } );
                
        }.bind( this ), MISC.globalTimerResolution );
    },
    destroy: function ( completely ) {
        clearInterval( this.globalIntervalId );
        if ( completely ) {
            this.timers = [];
        }
    },
    create: function ( guard, callback, name, scope ) {
        this.guid++;
        this.timers.push( { guid: this.guid, name: name, guard: guard, callback: callback, scope: scope } );
    },
    delete: function ( timerGuidOrName ) {
        this.timers = this.timers.filter( function ( t ) {
            if ( typeof timerGuidOrName === "string" ) {
                return t.name !== timerGuidOrName;
            }
            return t.guid !== timerGuidOrName;
        } );
    }
};