
		function solution(A) {
			console.log('the length of Array is ' + A.length);
			if (!(A.length > 2))
				return -1;
			res = -1;
			i = 0;
			while (i < A.length - 2) {
				while ((A[i] <= A[i + 1]) && (i < (A.length - 1))) {
					i++;
				}
				//getDecreasingSecuence
				p = i;
				while ((A[i] > A[i + 1]) && (i < (A.length - 1))) {
					i++;
				}
				q = i;
				//GetIncreasingSecuence
				while ((A[i] < A[i + 1]) && (i < (A.length - 1))) {
					i++;
				}
				r = i;
				console.log('p = ' + p + 'q = ' + q + 'r' + r)
				if ((p < q) && (q < r)) {
					first_depth = A[p] - A[q];
					second_depth = A[r] - A[q];
					the_depth = (first_depth > second_depth) ? (second_depth)
							: (first_depth);
					if (res < the_depth) {
						res = the_depth;
					}
				}
			}
			return res;

		}
