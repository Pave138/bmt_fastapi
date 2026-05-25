from time import time
from functools import wraps


def measure_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time()
        result = func(*args, **kwargs)
        end_time = time()

        execution_time = end_time - start_time
        print(f'Выполнено за {execution_time} секунд.')
        return result
    return wrapper()
