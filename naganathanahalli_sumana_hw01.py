1.1 
def get_transpose(matrix):
    rows = len(matrix)
    cols = len(matrix[0]) 
    transpose = []
    for j in range(cols):
        new_row = []
        for i in range(rows):
            new_row.append(matrix[i][j])
        transpose.append(new_row)

    return transpose

1.2
def merge_elements(sequences):
    return[element for seq in sequences for element in seq]

#1.3
def remove_tails(items):
    return items[:-1]

#1.4
def select_alternate(seq):
    return seq[::2]

#1.5 
def convert_to_mixed(identifier):
    parts = [p.lower() for p in identifier.strip("_") if p]
    if not  parts:
        return ""
    
    return parts[0] + "".join(word.capitalize() for p in parts[1:])

#2.0.1

def prefixes(s):
    for i in range(len(s)+1):
        yield seq[:i]

def suffixes(s):
    for i in range(len(s)+1):
        yield seq[i:]

#2.0.2
def segments(seq):
    n = len(seq)
    for i in range(n):
        for j in range(i+1, n+1):
            yield seq[i:j]

#3.0.1
class Polynomial:
    def __init__(self, polynomial):
        self.polynomial = tuple(polynomial)
    def get_polynomial(self):
        return self._polynomial

#3.0.2
class Polynomial:
    def __neg__(self):
        return Polynomial([-coeff for coeff in self.polynomial])
    
#3.0.3
class Polynomial:
    def __add__(self, other):
        return Polynomial(self._polynomial + other._polynomial)
    
#3.0.4
class Polynomial:
    def __sub__(self, other):
        negative_other = [ -coeff for coeff in other._polynomial]
        return Polynomial(self._polynomial + tuple(negative_other))

#3.0.5
class Polynomial:
    def __mul__(self, other):
        product = []
        return Polynomial(product)
    
#3.0.6
class Polynomial:
    def __call__(self, x):
        result = 0
        for power, coeff in enumerate(self._polynomial):
            result += coeff * (x ** power)
        return result
    
#3.0.7
class Polynomial:
    def simplify(self):
        combined = {}
        

#3.0.8
class Polynomial:
    def __str__(self):
        if self._polynomial == ((0,0)):
            return "0"
        terms = []

#4.1
import numpy as np
def sort_array(list_of_matrices):
    combined = np.concatenate([mat.flatten() for mat in list_of_matrices])
    return np.sort(combined.astype(int))[::-1]

#4.2
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
def POS_tag(sentence):
    sentence = sentence.lower()
    words = word_tokenize(sentence)
    stop_wrd = set(stopwords.words('english'))
    words = [w for w in words if w not in stop_wrd and w not in string.punctuation]
    tag = nltk.pos_tag(words)
    return tag    