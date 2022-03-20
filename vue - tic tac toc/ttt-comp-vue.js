Vue.component('tic', {
    props: ['val'],
    template: `<div @click="$emit('click')" class="cell"><span>{{val}}</span></div>`
})

Vue.component('board', {
    data: function() {
        return {
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            next: 1,
            total: 0,
            xwin: 0,
            xloss: 0,
            play: false,
        }
    },
    template: `
    <div class="boardtop">
        <p> Total matches played: {{total}} </p>
        <p> X: Win: {{xwin}}, Loss: {{xloss}}, Draw {{total - xwin - xloss}} </p>
        <p>  O: Win: {{xloss}}, Loss: {{xwin}}, Draw {{total - xwin - xloss}} </p>
        
        <span v-html="headmsg"></span>
        <div class="board">
            <div v-for="(n, i) in 9">
                <tic :val="v2c(board[i])" @click="update(i)"></tic>
            </div>
        </div>
<br>
        <button :disabled = "!play" v-on:click = "again"> Play Again </button>
    </div>
    `,
    methods: {
        v2c(r) {
            return (r == 1) ? 'X' : (r == -1) ? 'O' : '';
        },

        again: function () {
            this.play = false;
            this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.next = 1;
        },

        update(i) {
            if (this.result == 0) {
                if (this.board[i] == 0) {
                    Vue.set(this.board, i, this.next);
                    this.next = -this.next;
                }
            }
        }
    },
    computed: {
        headmsg: function() {
            let msg = "";
            switch(this.result) {
                case 0: msg = `<h1>Next move: ${this.v2c(this.next)}</h1>`; break;
                case 1: msg = `<h1>Congratulations X`; break;
                case -1: msg = `<h1>Congratulations O`; break;
                case 2: msg = `<h1>Boring draw!</h1>`; break;
                default: msg = "Hello?"; break;
            }
            return msg;
        },
        result: function() {
            let patts = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
            for (p of patts) {
                const sum = p.reduce((a, i) => a + this.board[i], 0);
                if (sum == 3) {
                    this.play = true;
                    this.total++;
                    this.xwin++;
                    return 1;   // X won
                } else if (sum == -3) {
                    this.play = true;
                    this.xloss++;
                    this.total++;
                    return -1;  // O won
                }
            }
            for (i in this.board) {
                if (this.board[i] == 0) return 0;    // Still in progress
            }
            this.play = true;
            this.total++;
            return 2;   // Draw
        }
    }
})

var app = new Vue({
    el: '#app',
})
